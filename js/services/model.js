manywho.service('model', function () {

    function contains(collection, id, key) {
        var selectedItem = collection.filter(function (item) {
            return item[key] == id;
        });
        return (selectedItem && selectedItem.length > 0);
    }

    function get(collection, id, key) {
        var selectedItem = collection.filter(function (item) {
            return item[key] == id;
        });
        if (selectedItem && selectedItem.length > 0) {
            return selectedItem[0];
        }
        return null;
    }

    function getAll(map, id, key) {
        var items = [];
        for (var name in map) {
            if (map[name][key] == id) {
                items.push(map[name]);
            }
        }
        return items;
    }

    function updateData(collection, item, key) {
        var data = get(collection, item.id, key);
        if (data != null) {
            return angular.extend({}, item, data);
        }
        return item;
    }

    function flattenContainers(containers, parent, result) {
        if (containers != null) {
            for (var index = 0; index < containers.length; index++) {
                var item = containers[index];
                if (parent) {
                    item.parent = parent.id;
                    if (!parent.childCount) {
                        parent.childCount = 0;
                    }
                    parent.childCount++;
                }
                result.push(item);
                flattenContainers(item.pageContainerResponses, item, result);
            }
        }
        return result;
    }

    return {

        containers: {},
        components: {},
        outcomes: {},
        componentInputResponseRequests: {},

        fetch: function (tenantId, flowId, elementId) {

            var response = JSON.parse(testdata);

            var containers = flattenContainers(response.mapElementInvokeResponses[0].pageResponse.pageContainerResponses, null, []);
            containers.forEach(function (item) {

                this.containers[item.id] = item;
                if (contains(response.mapElementInvokeResponses[0].pageResponse.pageContainerDataResponses, item.id, 'pageContainerId')) {
                    this.containers[item.id] = updateData(response.mapElementInvokeResponses[0].pageResponse.pageContainerDataResponses, item, 'pageContainerId');
                }

            }, this);

            response.mapElementInvokeResponses[0].pageResponse.pageComponentResponses.forEach(function (item) {

                this.components[item.id] = item;
                if (contains(response.mapElementInvokeResponses[0].pageResponse.pageComponentDataResponses, item.id, 'pageComponentId')) {
                    this.components[item.id] = updateData(response.mapElementInvokeResponses[0].pageResponse.pageComponentDataResponses, item, 'pageComponentId');
                }

                // Create the input response information so we have the page state that needs
                // to be sent back to the engine pre-configured and ready to update on events
                this.componentInputResponseRequests[item.id] = {
                    'pageComponentId': item.id,
                    'contentValue': null,
                    'objectData': null
                };

            }, this);

            response.mapElementInvokeResponses[0].outcomeResponses.forEach(function (item) {
                this.outcomes[item.id.toLowerCase()] = item;
            }, this);

        },

        getChildren: function (containerId) {

            if (containerId == 'root') {
                return getAll(this.containers, null, 'parent');
            }

            var children = [];
            var container = this.containers[containerId];

            if (container != null) {
                children = children.concat(getAll(this.containers, containerId, 'parent'));
                children = children.concat(getAll(this.components, containerId, 'pageContainerId'));
            }

            children.sort(function (a, b) {
                return a.order - b.order;
            });

            return children;

        },

        getContainer: function(containerId) {
            return this.containers[containerId];
        },

        getComponent: function (componentId) {
            return this.components[componentId];
        },

        getOutcome: function (outcomeId) {
            return this.outcomes[outcomeId.toLowerCase()];
        },

        getOutcomes: function (pageObjectId) {

            var pageObjectOutcomes = [];
            
            for (outcomeId in this.outcomes)
            {
                var item = this.outcomes[outcomeId];

                // If the directive has supplied an object id, we find the bound outcomes, otherwise
                // we find all outcomes that are unbound
                if ((item.pageObjectBindingId != null && item.pageObjectBindingId.toLowerCase() == pageObjectId.toLowerCase())
                    || (item.pageObjectBindingId == null || item.pageObjectBindingId.trim().length == 0)) {
                    pageObjectOutcomes.push(item);
                }
            }

            return pageObjectOutcomes;

        },

        setComponentInputResponseRequest: function (componentId, contentValue, objectData) {

            this.componentInputResponseRequests[componentId].contentValue = contentValue;
            this.componentInputResponseRequests[componentId].objectData = objectData;

        }

    }

});