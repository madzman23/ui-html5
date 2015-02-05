manywho.ajax = (function (manywho) {

    function onError(xhr, status, error) {

        log.error(error);

    }

    return {

        initialize: function (engineInitializationRequest) {

            log.info('Initializing Flow: \n    Id: ' + engineInitializationRequest.flowId.id + '\n    Version Id: ' + engineInitializationRequest.flowId.versionId);

            return $.ajax({
                url: 'https://flow.manywho.com/api/run/1',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                processData: true,
                data: JSON.stringify(engineInitializationRequest),
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('ManyWhoTenant', manywho.model.getTenantId());

                    if (manywho.settings.get('initialization.beforeSend')) {
                        manywho.settings.get('initialization.beforeSend').call(this, xhr);
                    }

                }
            })
            .done(manywho.settings.get('initialization.done'))
            .fail(onError)
            .fail(manywho.settings.get('initialization.fail'));

        },

        join: function(stateId) {

            log.info('Joining State: ' + stateId);

            return $.ajax({
                url: 'https://flow.manywho.com/api/run/1/state/' + stateId,
                type: 'GET',
                contentType: 'application/json',
                processData: true,
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('ManyWhoTenant', manywho.model.getTenantId());

                    if (manywho.settings.get('join.beforeSend')) {
                        manywho.settings.get('join.beforeSend').call(this, xhr);
                    }

                }
            })
            .done(manywho.settings.get('join.done'))
            .fail(onError)
            .fail(manywho.settings.get('join.fail'));

        },
        
        invoke: function (engineInvokeRequest) {

            return $.ajax({
                url: 'https://flow.manywho.com/api/run/1/state/' + engineInvokeRequest.stateId,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                processData: true,
                data: JSON.stringify(engineInvokeRequest),
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('ManyWhoTenant', manywho.model.getTenantId());

                    if (manywho.settings.get('invoke.beforeSend')) {
                        manywho.settings.get('invoke.beforeSend').call(this, xhr);
                    }

                }
            })
            .done(manywho.settings.get('invoke.done'))
            .fail(onError)
            .fail(manywho.settings.get('invoke.fail'));

        },

        getNavigation: function (stateId, stateToken, navigationElementId) {
            
            return $.ajax({
                url: 'https://flow.manywho.com/api/run/1/navigation/' + stateId,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                processData: true,
                data: JSON.stringify({ 'stateId': stateId, 'stateToken': stateToken, 'navigationElementId': navigationElementId }),
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('ManyWhoTenant', manywho.model.getTenantId());

                    if (manywho.settings.get('navigation.beforeSend')) {
                        manywho.settings.get('navigation.beforeSend').call(this, xhr);
                    }

                }
            })
            .done(manywho.settings.get('navigation.done'))
            .fail(onError)
            .fail(manywho.settings.get('navigation.fail'));

        },

        syncEngine: function (engineInvokeRequest) {

            alert('Sync!');

        },

        dispatchObjectDataRequest: function (request, limit, search, orderBy, orderByDirection, page) {

            request.listFilter = request.listFilter || {};           
            request.listFilter.limit = limit;
            request.listFilter.search = search || null;
            
            if (orderBy) {
                request.listFilter.orderBy = orderBy;
                request.listFilter.orderByDirection = orderByDirection;
            }

            if (page > 0) {
                request.listFilter.offset = page * request.listFilter.limit;
            }

            log.info('Dispatching object data request');

            return $.ajax({
                url: 'https://flow.manywho.com/api/service/1/data',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                processData: true,
                data: JSON.stringify(request),
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('ManyWhoTenant', manywho.model.getTenantId());

                    if (manywho.settings.get('objectData.beforeSend')) {
                        manywho.settings.get('objectData.beforeSend').call(this, xhr);
                    }

                }
            })
            .done(manywho.settings.get('objectData.done'))
            .fail(onError)
            .fail(manywho.settings.get('objectData.fail'));

        }

    }

})(manywho);