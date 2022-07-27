
import { Component } from '@angular/core';
import { ViewChild, NgZone} from '@angular/core';
import { WebdatarocksComponent } from 'ng-webdatarocks';
import * as Highcharts from "highcharts";


function getJSONData() {
  return [{
          "Category": {
              type: "level",
              hierarchy: "Food"
          },
          "Item": {
              type: "level",
              hierarchy: "Food",
              level: "Dish",
              parent: "Category"
          },
          "Serving Size": {
              type: "level",
              hierarchy: "Food",
              level: "Size",
              parent: "Dish"
          },
          "Calories": {
              type: "number"
          },
          "Calories from Fat": {
              type: "number"
          }
      },
      {
          "Category": "Breakfast",
          "Item": "Frittata",
          "Serving Size": "4.8 oz (136 g)",
          "Calories": 300,
          "Calories from Fat": 120
      },
      {
          "Category": "Breakfast",
          "Item": "Boiled eggs",
          "Serving Size": "4.8 oz (135 g)",
          "Calories": 250,
          "Calories from Fat": 70
      },
      {
          "Category": "Breakfast",
          "Item": "Sunny-side up eggs",
          "Serving Size": "3.9 oz (111 g)",
          "Calories": 370,
          "Calories from Fat": 200
      },
      {
          "Category": "Breakfast",
          "Item": "Chocolate Cake",
          "Serving Size": "5.7 oz (161 g)",
          "Calories": 450,
          "Calories from Fat": 250
      },
      {
          "Category": "Breakfast",
          "Item": "Sausages",
          "Serving Size": "5.7 oz (161 g)",
          "Calories": 400,
          "Calories from Fat": 210
      },

      {
          "Category": "Breakfast",
          "Item": "English Breakfast & Cookie",
          "Serving Size": "5.3 oz (150 g)",
          "Calories": 460,
          "Calories from Fat": 230
      },
      {
          "Category": "Breakfast",
          "Item": "Cheesecake",
          "Serving Size": "5.8 oz (164 g)",
          "Calories": 420,
          "Calories from Fat": 270
      },
      {
          "Category": "Breakfast",
          "Item": "Honey Oatmeal",
          "Serving Size": "9.6 oz (251 g)",
          "Calories": 290,
          "Calories from Fat": 35
      },

      {
          "Category": "Beef & Pork",
          "Item": "Steak",
          "Serving Size": "7.1 oz (202 g)",
          "Calories": 520,
          "Calories from Fat": 240
      },
      {
          "Category": "Chicken & Fish",
          "Item": "Grilled Chicken",
          "Serving Size": "7 oz (200 g)",
          "Calories": 350,
          "Calories from Fat": 80
      },
      {
          "Category": "Chicken & Fish",
          "Item": "Chicken Sandwich",
          "Serving Size": "8.8 oz (249 g)",
          "Calories": 670,
          "Calories from Fat": 300
      },
      {
          "Category": "Chicken & Fish",
          "Item": "Fish Sandwich",
          "Serving Size": "7.6 oz (217 g)",
          "Calories": 450,
          "Calories from Fat": 130
      }, {
          "Category": "Beverages",
          "Item": "Banana Smoothie",
          "Serving Size": "13.4 oz (381 g)",
          "Calories": 300,
          "Calories from Fat": 50
      }
  ];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-pivot-poc';
  @ViewChild('pivot1')
  child!: WebdatarocksComponent;

  Highcharts: typeof Highcharts = Highcharts;


  constructor(
    private ngZone: NgZone,
  ) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    (window as any)['angularComponentReference'] = { component: this, zone: this.ngZone, loadAngularFunction: (event: any) => this.onChangeCell(event), } as  any;

  }

  ngAfterViewInit() {
    console.log('ngAfterBiewInit', this.child)
  }

  onPivotReady(pivot: WebDataRocks.Pivot): void {
    console.log('[ready] WebdatarocksPivotModule', this.child);
    console.log(this.child.webDataRocks.highcharts);

  }

  public pivotReport = {
    dataSource: {
      filename: "https://cdn.webdatarocks.com/data/data.csv"
    },
    slice: {
      rows: [{ uniqueName: "Country" }],
      columns: [{ uniqueName: "Measures" }],
      measures: [{ uniqueName: "Price", aggregation: "sum" }]
    }
  };

  onReportComplete(): void {
    console.log('onReportComplete', this.child.webDataRocks);
    this.child.webDataRocks.off('reportcomplete');
    this.createAreaChart();
    //this.createBarChart();
    /*this.child.webDataRocks.setReport({
      dataSource: {
        filename: 'https://cdn.webdatarocks.com/data/data.json',
      },
    });*/
  }

  createAreaChart() {
    console.log('createAreaChart', this.child.webDataRocks);
    this.child.webDataRocks.highcharts?.getData(
      {
        type: "areaspline"
      },
      data => {
        console.log('set highchart data');
        this.Highcharts.setOptions({
          plotOptions: {
            series: {
              color: "#2a8000" // set colors of the series
            }
          }
        });
        this.Highcharts.chart("highchartsContainer-1", data);
      },
      data => {
        this.Highcharts.setOptions({
          plotOptions: {
            series: {
              color: "#2a8000" // set colors of the series
            }
          }
        });
        console.log('set highchart data');
        this.Highcharts.chart("highchartsContainer-1", data);
      }
    );
  }

  onChangeCell(event: any) {
    console.log('on change cell', event);
    let modDataObj : any= {};
  let newValueStr = event.target.value.replace(/\s/g,'');
  modDataObj.newValue = parseInt(newValueStr, 10);

  modDataObj.cell = JSON.parse(event.target.getAttribute("data-cell"));
  modDataObj.oldValue = modDataObj.cell.value;

  modDataObj.delta = modDataObj.newValue - modDataObj.oldValue;

  console.log("cell:", modDataObj.cell);
  console.log("old value:", modDataObj.oldValue);
  console.log("new value:", modDataObj.newValue);
  console.log("delta:", modDataObj.delta);
  }

  onCustomizeCell(
    cell: WebDataRocks.CellBuilder,
    data: WebDataRocks.CellData
  ): void {
    const onChangeCell = (event: any) =>{
        console.log('onchange', event);
    }
    if (data.isClassicTotalRow) {
      cell.addClass('fm-total-classic-r');
    }
    if (data.isGrandTotalRow) {
      cell.addClass('fm-grand-total-r');
    }
    if (data.isGrandTotalColumn) {
      cell.addClass('fm-grand-total-c');
    }
    if (data && data.type == "value") {
      cell.addClass("editable");
      cell.text = `<input type="text" value="${data.label}" onchange="callAngularFunction(event);" data-cell='${JSON.stringify(data)}'>`;
    }
  }

  report : any = {
    dataSource: {
        data: getJSONData()
    },
    formats: [{
        name: "calories",
        maxDecimalPlaces: 2,
        maxSymbols: 20,
        textAlign: "right"
    }],
    slice: {
        rows: [{
            uniqueName: "Food"
        }],
        columns: [{
            uniqueName: "Measures"
        }],
        measures: [{
            uniqueName: "Calories",
            aggregation: "average",
            format: "calories"
        }]
    }}



}
