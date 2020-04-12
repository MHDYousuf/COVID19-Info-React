import React, { useEffect, useState, useContext } from "react";
import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GlobalContext } from "../api/fetchData";
import { useMediaQuery } from "@material-ui/core";

am4core.useTheme(am4themes_animated);

function Globe() {
  const matches = useMediaQuery("(max-width:998px)");
  const { countryData, getCountryDetails } = useContext(GlobalContext);
  const [countryDetails, setCountryDetails] = useState([]);
  useEffect(() => {
    getCountryDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    //Set map definition
    chart.geodata = am4geodata_worldLow;

    // const countries = am4geodata_worldLow.features.map(
    //   ({ properties }) => properties
    // );

    // console.log(countries.map(({ name }) => name));

    //Set Projection
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.deltaLatitude = -20;
    chart.padding(40, 40, 40, 40);

    //Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = `<h4>{name}</h4>
    <p>Total Deaths: {value}</p>
    <hr />
    <p>Population: {data.population}</p>
    <p>Death-rate(%): {data.deathrate}</p>
    <p>Recovery-rate(%): {data.recoveryrate}</p>
    <hr />
    <h5>today</h5>
    <p>&emsp;Deaths: {data.today.deaths}</p>
    <p>&emsp;Confirmed: {data.today.confirmed}</p>
    `;

    //MHD
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonTemplate,
      min: am4core.color("#5085c7"),
      max: am4core.color("#1b3f6b"),
    });

    //blah finished

    polygonTemplate.fill = am4core.color("#fff");
    polygonTemplate.stroke = am4core.color("#000");
    polygonTemplate.strokeWidth = 0.5;

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    //MHD
    // add heat legend
    var heatLegend = chart.chartContainer.createChild(am4maps.HeatLegend);
    heatLegend.valign = "bottom";
    heatLegend.align = "right";
    heatLegend.width = am4core.percent(40);
    heatLegend.series = polygonSeries;
    if (!matches) heatLegend.marginRight = 40;
    heatLegend.marginTop = 20;
    heatLegend.background.fill = am4core.color("#000");
    heatLegend.background.fillOpacity = 0.05;
    heatLegend.orientation = "horizontal";
    heatLegend.padding(5, 5, 5, 5);
    heatLegend.valueAxis.renderer.labels.template.fill = "#bddbff";
    heatLegend.valueAxis.renderer.labels.template.fontSize = 12;
    heatLegend.valueAxis.renderer.minGridDistance = 35;

    polygonSeries.mapPolygons.template.events.on("over", (event) => {
      handleHover(event.target);
    });

    polygonSeries.mapPolygons.template.events.on("hit", (event) => {
      handleHover(event.target);
    });

    function handleHover(mapPolygon) {
      if (!isNaN(mapPolygon.dataItem.value)) {
        heatLegend.valueAxis.showTooltipAt(mapPolygon.dataItem.value);
      } else {
        heatLegend.valueAxis.hideTooltip();
      }
    }
    polygonSeries.mapPolygons.template.strokeOpacity = 0.4;
    polygonSeries.mapPolygons.template.events.on("out", (event) => {
      heatLegend.valueAxis.hideTooltip();
    });

    //MHD

    //Blah finished

    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.valign = "top";

    //blah finished

    var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.line.stroke = am4core.color("#fffff");
    graticuleSeries.mapLines.template.line.strokeOpacity = 0.02;
    graticuleSeries.fitExtent = false;

    //Water
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
      "#bddbff"
    );
    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

    //Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#1b3f6b").brighten(-0.2);

    polygonSeries.data = countryDetails.map((value) => {
      return {
        id: value.id,
        data: {
          population: value.population,
          deathrate: value.death_rate,
          recoveryrate: value.recovery_rate,
          today: {
            deaths: value.today.deaths,
            confirmed: value.today.confirmed,
          },
        },
        value: value.total_death,
      };
    });
    // excludes Antarctica
    polygonSeries.exclude = ["AQ"];

    //Rotation function
    let animation;
    const trigger = () =>
      setTimeout(function () {
        animation = chart.animate(
          { property: "deltaLongitude", to: 100000 },
          8000000
        );
      }, 3000);
    trigger();
    chart.seriesContainer.events.on("down", function () {
      if (animation) {
        animation.stop();
      } else {
        animation.start();
      }
    });

    return () => {
      chart.dispose();
      clearTimeout(trigger);
    };
  }, [countryDetails.length !== 0]);

  useEffect(() => {
    if (countryData.length > 0) {
      let getValues = countryData.map((value) => {
        let deathrate = value.latest_data.calculated.death_rate;
        if (deathrate !== null)
          deathrate = value.latest_data.calculated.death_rate.toFixed(3);
        else deathrate = 0;
        let recoveryrate = value.latest_data.calculated.recovery_rate;
        if (recoveryrate !== null)
          recoveryrate = value.latest_data.calculated.recovery_rate.toFixed(3);
        else recoveryrate = 0;
        return {
          name: value.name,
          id: value.code,
          population: value.population,
          total_death: value.latest_data.deaths,
          death_rate: deathrate,
          recovery_rate: recoveryrate,
          today: {
            deaths: value.today.deaths,
            confirmed: value.today.confirmed,
          },
        };
      });
      setCountryDetails((newValue) => (newValue = getValues));
    }
  }, [countryData]);

  return <div id="chartdiv" style={{ width: "100%", height: "100vh" }}></div>;
}

export default Globe;
