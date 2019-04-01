import * as $ from 'jquery'
import * as _ from 'underscore'
import pullManager from './pullManager'
import PullFilter from './PullFilter'
import ElementFilter from './ElementFilter'
import Column from './Column'
import spec from 'spec/index'
import IndicatorFilter from 'IndicatorFilter'
import PageIndicatorHandler from 'pageIndicatorHandler'

/* eslint-disable no-unused-vars */
import 'ConnectionManager'

(<any>window).jQuery = $;
import 'bootstrap'
/* eslint-enable no-unused-vars */

declare var App: any;

// Note that not all of the required items above are represented in the
// function argument list. Some just need to be loaded, but that's all.

var globalPullFilter = new PullFilter(spec);
var globalElementFilter = ElementFilter(spec);
var globalIndicatorFilter = new IndicatorFilter(spec.indicators);

var pageIndicatorHandler = PageIndicatorHandler(spec.page_indicators, $(spec.page_indicator_box));

// Handle page indicators
pullManager.onUpdate(pageIndicatorHandler.handle);

if (spec.debug_indicators) {
   var debugIndicatorHandler = PageIndicatorHandler(spec.debug_indicators, $(spec.debug_indicator_box));

   pullManager.onUpdate(debugIndicatorHandler.handle);
}

_.each(spec.columns, function(columnSpec) {
   _.defaults(columnSpec, {
      navbar: spec.navbar
   });

   var pullFilter = new PullFilter(columnSpec);

   var elementFilter = ElementFilter(columnSpec, globalElementFilter);
   var indicatorFilter = new IndicatorFilter(columnSpec.indicators, globalIndicatorFilter);

   var col = new Column(elementFilter, indicatorFilter, columnSpec);

   globalPullFilter.onUpdate(pullFilter.update);
   pullFilter.onUpdate(col.update);
});

pullManager.onUpdate(globalPullFilter.update);

globalPullFilter.update(pullManager.getPulls());
