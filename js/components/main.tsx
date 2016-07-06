/*!
Copyright 2015 ManyWho, Inc.
Licensed under the ManyWho License, Version 1.0 (the "License"); you may not use this
file except in compliance with the License.
You may obtain a copy of the License at: http://manywho.com/sharedsource
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the specific language governing
permissions and limitations under the License.
*/

/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    var main = React.createClass({

        mixins: [manywho.component.mixins.enterKeyHandler],

        componentDidMount: function() {
            manywho.utils.removeLoadingIndicator('loader');

            if (manywho.settings.global('syncOnUnload', this.props.flowKey, true))
                window.addEventListener("beforeunload", (event) => manywho.engine.sync(this.props.flowKey));
        },

        componentDidUpdate: function() {
            if (!manywho.utils.isEmbedded()) {
                var main = this.refs.main.getDOMNode();
                var nav = this.refs.nav.getDOMNode();

                var height = main.clientHeight + ((nav) ? nav.clientHeight : 0);

                if (height <= window.innerHeight) {
                    document.body.style.height = "100%";
                    document.documentElement.style.height = "100%";
                }
                else {
                    document.body.style.height = "auto";
                    document.documentElement.style.height = "auto";
                }
            }
        },

        render: function () {
            manywho.log.info("Rendering Main");

            const children = manywho.model.getChildren('root', this.props.flowKey);
            const outcomes = manywho.model.getOutcomes('root', this.props.flowKey);
            const state = manywho.state.getComponent('main', this.props.flowKey) || {};
            const attributes = manywho.model.getAttributes(this.props.flowKey);
            const componentElements = manywho.component.getChildComponents(children, this.props.id, this.props.flowKey);
            const isFixedFooter: boolean = attributes != null && manywho.utils.isEqual(attributes.outcomes, "fixed", true)
            
            if (state && state.loading == null && !manywho.utils.isEqual(manywho.model.getInvokeType(this.props.flowKey), 'sync', true))
                manywho.component.focusInput(this.props.flowKey);

            let outcomeElements = manywho.component.getOutcomes(outcomes, this.props.flowKey);
            let fixedFooter = null;

            if (isFixedFooter) {
                fixedFooter = React.createElement(manywho.component.getByName('footer'), { flowKey: this.props.flowKey }, outcomeElements);
                outcomeElements = null;
            }
            
            let containerClassName = "full-height clearfix";
            let classNames = 'main';

            classNames += (manywho.settings.global('isFullWidth', this.props.flowKey, false)) ? ' container-fluid full-width' : ' container';
                
            if (manywho.settings.isDebugEnabled(this.props.flowKey))
                classNames += ' main-debug';

            if (manywho.settings.global('history', this.props.flowKey))
                classNames += ' main-history';

            if (isFixedFooter)
                containerClassName += " has-footer";            

            const content = (<div className={containerClassName}>
                {React.createElement(manywho.component.getByName('navigation'), { id: manywho.model.getDefaultNavigationId(this.props.flowKey), flowKey: this.props.flowKey, ref: 'nav' })}
                <div className={classNames} onKeyUp={this.onEnter} ref="main">
                    <h2 className="page-label">{manywho.model.getLabel(this.props.flowKey)}</h2>
                    {componentElements}
                    {outcomeElements}
                    {React.createElement(manywho.component.getByName('status'), { flowKey: this.props.flowKey })}
                    {React.createElement(manywho.component.getByName('voting'), { flowKey: this.props.flowKey })}
                    {React.createElement(manywho.component.getByName('feed'), { flowKey: this.props.flowKey })}
                </div>
                {React.createElement(manywho.component.getByName('debug'), { flowKey: this.props.flowKey })}
                {React.createElement(manywho.component.getByName('history'), { flowKey: this.props.flowKey })}
                {React.createElement(manywho.component.getByName('notifications'), { flowKey: this.props.flowKey, position: 'left' })}
                {React.createElement(manywho.component.getByName('notifications'), { flowKey: this.props.flowKey, position: 'center' })}
                {React.createElement(manywho.component.getByName('notifications'), { flowKey: this.props.flowKey, position: 'right' })}
                {React.createElement(manywho.component.getByName('wait'), { isVisible: state.loading, message: state.loading && state.loading.message }, null)}
            </div>);

            if (isFixedFooter)
                return (<div className="full-height footer-fixed-wrapper">
                    {content}
                    {fixedFooter}
                </div>);
            else
                return content;
        }
    });

    manywho.component.register("main", main);

}(manywho));
