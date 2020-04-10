import React, { useEffect, useState, useContext } from "react";
import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GlobalContext } from "../api/fetchData";

am4core.useTheme(am4themes_animated);

function Globe() {
  useEffect(() => {
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
    return () => {
      chart.dispose();
    };
  }, []);

  const { countryData, getCountryDetails } = useContext(GlobalContext);

  useEffect(() => {
    getCountryDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div id="chartdiv" style={{ width: "100%", height: "100vh" }}></div>;
}

export default Globe;
