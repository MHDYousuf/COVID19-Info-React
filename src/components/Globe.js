import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

// class Globe extends Component {
//   componentDidMount() {
//     let chart = am4core.create("chartdiv", am4charts.XYChart);

//     chart.paddingRight = 20;

//     let data = [];
//     let visits = 10;
//     for (let i = 1; i < 366; i++) {
//       visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
//       data.push({
//         date: new Date(2018, 0, i),
//         name: "name" + i,
//         value: visits,
//       });
//     }

//     chart.data = data;

//     let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
//     dateAxis.renderer.grid.template.location = 0;

//     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//     valueAxis.tooltip.disabled = true;
//     valueAxis.renderer.minWidth = 35;

//     let series = chart.series.push(new am4charts.LineSeries());
//     series.dataFields.dateX = "date";
//     series.dataFields.valueY = "value";

//     series.tooltipText = "{valueY.value}";
//     chart.cursor = new am4charts.XYCursor();

//     let scrollbarX = new am4charts.XYChartScrollbar();
//     scrollbarX.series.push(series);
//     chart.scrollbarX = scrollbarX;

//     this.chart = chart;
//   }

//   componentWillUnmount() {
//     if (this.chart) {
//       this.chart.dispose();
//     }
//   }

//   render() {
//     return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
//   }
// }

class Globe extends Component {
  componentDidMount() {
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    //Set map definition
    chart.geodata = am4geodata_worldLow;

    const countries = am4geodata_worldLow.features.map(
      ({ properties }) => properties
    );

    // console.log(countries.map(({ name }) => name));

    //Set Projection
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.deltaLatitude = -20;
    chart.padding(80, 80, 80, 80);

    //Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    //Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#47c78a");
    polygonTemplate.stroke = am4core.color("#454a58");
    polygonTemplate.strokeWidth = 0.5;

    var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.line.stroke = am4core.color("#fffff");
    graticuleSeries.mapLines.template.line.strokeOpacity = 0;
    graticuleSeries.fitExtent = false;

    //Water
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
      "#0e90b8"
    );
    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

    //Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);

    //Rotation function
    var animation;
    function rotateTo(long, lat) {
      if (animation) {
        animation.stop();
      }
      animation = chart.animate(
        [
          {
            property: "deltaLongitude",
            to: long,
          },
          {
            property: "deltaLatitude",
            to: lat,
          },
        ],
        2000
      );
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return <div id="chartdiv" style={{ width: "100%", height: "100vh" }}></div>;
  }
}

export default Globe;
