import React, {Component,useState} from 'react';
import {connect} from 'react-redux';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components';
import {theme} from '@kepler.gl/styles';
import * as echarts from 'echarts';
import store from './store';
import calculateDistance,{filterData} from "./caldistance";

import sampleData2019, {config}from './data/merge_2019';
// import sampleData2022, {config} from './data/merge_2022';
// import sampleData, {config} from './data/sample-data';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

import {
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  CustomPanelsFactory,
  MapPopoverFactory,
  injectComponents
} from '@kepler.gl/components';
import {
  updateMouselng, 
  updateMouselat,
  updateQueryflights
} from './actions';

import CustomPanelHeaderFactory from './components/panel-header';
import CustomSidebarFactory from './components/side-bar';
import CustomPanelToggleFactory from './components/panel-toggle';
import CustomSidePanelFactory from './components/custom-panel';
import CustomMapPopoverFactory from './components/custom-map-popover';
import { rangeBrushBgd } from '@kepler.gl/styles/dist/base';

const StyledMapConfigDisplay = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 10px;
  background-color: ${theme.sidePanelBg};
  font-size: 11px;
  width: 300px;
  color: ${theme.textColor};
  word-wrap: break-word;
  min-height: 60px;
  padding: 10px;
`;

// Inject custom components
const KeplerGl = injectComponents([
  [SidebarFactory, CustomSidebarFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory],
  [PanelToggleFactory, CustomPanelToggleFactory],
  [CustomPanelsFactory, CustomSidePanelFactory],
  [MapPopoverFactory, CustomMapPopoverFactory]
]);

class Epie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isVisible: !prevState.isVisible
    }));
  };

  componentDidUpdate(){
    //筛选算法==>src/data/sample-data.js
    // 基于准备好的dom，初始化echarts实例
    var {arr}=this.props;
    var xData=['00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-23:59', ];
    var yData=xData.map(v=>{
      let time=v.split('-');
      let num=0;
      arr.map(v=>{
        let timeStart=new Date(v[8])
        let nTime=new Date(v[8].slice(0,10)+' '+time[0])
        let endTime=new Date(v[8].slice(0,10)+' '+time[1])
        if(timeStart>nTime&&timeStart<=endTime){
          num++
        }
      })
      return num
    })
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      legend: {
        top: 'bottom',
      },
      title: {
        text: '分时段航班数',
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [10, 80],
          center: ['50%', '45%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: yData[0], name: '凌晨 00:00-06:00' },
            { value: yData[1], name: '上午 06:00-12:00' },
            { value: yData[2], name: '下午 12:00-18:00' },
            { value: yData[3], name: '夜晚 18:00-23:59' }
          ]
        }
      ]
    });
  }

  render() {  
    // console.log(store.getState());
    const mouselng = store.getState().app.mouselng;
    const mouselat = store.getState().app.mouselat;
    const { isVisible } = this.state;
    const buttonText = isVisible ? "P" : "p";
    return (
        <div>
          <button 
          style={{
            position: "absolute",
            right:12,
            top: 265,
            width:"32px",height:"32px",
            backgroundColor:'rgb(41,50,60)',
            color:'rgb(106,116,133)',
          }} 
            onClick={this.handleClick}>{buttonText}</button>
          <div 
          style={{
            transition: "margin 1s, height 1s",
            position: "absolute",
            width: "20%",
            height: "30.3%",
            left:475,
            bottom: 30,
            backgroundColor:'rgba(240,255,255,0.5)',
            borderColor:'rgb(41,50,60)',
            display: isVisible ? 'block' : 'none'
          }}
          >
            <div id="main" style={{width:"300px",height:"220px"}}></div>
          </div>
               
        </div>
    );
  }
}

class Eline extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isVisible: !prevState.isVisible
    }));
  };
  componentDidUpdate(){
    //筛选算法==>src/data/sample-data.js
    // 基于准备好的dom，初始化echarts实例
    var {arr}=this.props;
    var xData=['00','01','02','03','04','05','06','07','08','09','10','11',
    '12','13','14','15','16','17','18','19','20','21','22','23','24'];
    var yData=xData.map(v=>{
      let time= v;
      let num=0;
      arr.map(v=>{
        let timeStart=new Date(v[8]).getHours()
        if(timeStart>=Number(time)&&timeStart<=Number(time) + 1){
          num++
        }
      })
      return num
    })

    var myChart = echarts.init(document.getElementById('main2'));
    // 绘制图表
    myChart.setOption({
      title: {
        text: '逐小时航班数'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['航班']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '航班',
          type: 'line',
          stack: 'Total',
          data: yData
        }
      ]
    });
  }
  render() {  
    // console.log(store.getState());
    const { isVisible } = this.state;
    const buttonText = isVisible ? "L" : "l";
    const mouselng = store.getState().app.mouselng;
    const mouselat = store.getState().app.mouselat;
    return (
      <div>
        <button 
        style={{
          position: "absolute",
          right:12,
          top: 305,
          width:"32px",height:"32px",
          backgroundColor:'rgb(41,50,60)',
          color:'rgb(106,116,133)',
        }} 
          onClick={this.handleClick}>{buttonText}</button>
        <div style={{
          transition: "margin 1s, height 1s",
          position: "absolute",
          width: "47%",
          height: "30.3%",
          right: 22,
          bottom: 30,
          backgroundColor:'rgba(240,255,255,0.5)',
          display: isVisible ? 'block' : 'none'
        }}
        >
          <div id="main2" style={{width:"720px",height:"220px"}}></div>
        </div>
      </div>
    );
  }
}

class From extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isVisible: !prevState.isVisible
    }));
  };

  componentDidMount() {

  }
  
  render(){
    const mouselng = store.getState().app.mouselng;
    const mouselat = store.getState().app.mouselat;
    const { isVisible } = this.state;
    const buttonText = isVisible ? "F" : "f";
    var {arr:numbersArray}=this.props;
    var arrayLength = numbersArray.length;

    return (
      <div>
        <button 
        style={{
          position: "absolute",
          right:12,
          top: 345,
          width:"32px",height:"32px",
          backgroundColor:'rgb(41,50,60)',
          color:'rgb(106,116,133)',
        }} 
          onClick={this.handleClick}>{buttonText}</button>
        <div style={{
          transition: "margin 1s, height 1s",
          position: "absolute",
          width: 254,
          height: "100%",
          left: 35,
          top: 0,
          backgroundColor:'rgba(240,255,255,0.2)',
          borderColor:'rgba(0,0,0,0.5)',
          display: isVisible ? 'block' : 'none'
          }}
        >

          {/* FLIGHT */}
          <div style={{
            backgroundImage: 'url("/images/border.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height:50
            }}>
              <h2 style={{
                textAlign:'center',
                
                color:'rgb(124,191,245)',
                fontFamily: 'Arial, sans-serif',
                paddingTop: '10px',
                textShadow: '1px 1px 0 #FFD700',
                }}>
                ----------FLIGHT----------
              </h2>
          </div>
          {/* 当前坐标 */}
          <div style={{
            textAlign:'center',
            // color:'#F5F5F5',
            color:'#F5F5F5',
            textShadow: '1px 1px 0 rgb(104,216,254)',
            }}>
            <h3>当前坐标</h3>
          </div>
          {/* 坐标 */}
          <div style={{
              fontSize:16,
              textAlign:'left',
              color:'rgb(213,237,239)',
              lineHeight:'1.5',
              borderImage: 'linear-gradient(to right,dodgerblue,lightblue, white,cornflowerblue) 1',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderRadius: '10px',
              padding: '10px',
            }}>
              LNG:{mouselng}<br/>
              LAT:{mouselat}
          </div>  
          {/* 航班查询 */}
          <div style={{
            textAlign:'center',
            color:'#F5F5F5',
            textShadow: '1px 1px 0 rgb(104,216,254)',
            }}>
            <h3>航班查询</h3>
          </div>
          {/* 表格 */}
          <div style={{
              textAlign:'left',
              color:'rgb(213,237,239)',
              lineHeight:'1.5',
              borderImage: 'linear-gradient(to right,dodgerblue,lightblue, white,cornflowerblue) 1',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderRadius: '10px',
              padding: '10px',
              height:'370px',
              overflowX:'auto',
              overflowY:'auto',}}>  
            {numbersArray.map((value, index) => (
              <div>
                <p style={{fontWeight:'bold',fontSize:'20px'}} >航班号:{value[5]}</p>
                <p style={{fontSize:'13px'}}>出发机场:{value[6]}</p>
                <p style={{fontSize:'13px'}}>到达机场:{value[7]}</p>
                <p style={{fontSize:'13px'}}>出发时间:{value[8]}</p>
                <p style={{fontSize:'13px'}}>到达时间:{value[9]}</p>
              </div>
            ))}

          </div>
          <div style={{
              textAlign:'left',
              color:'rgb(213,237,239)',
              lineHeight:'1.5',
              borderImage: 'linear-gradient(to right,dodgerblue,lightblue, white,cornflowerblue) 1',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderRadius: '10px',
              padding: '1px',
              height:'370px',
              overflowX:'auto',
              overflowY:'auto',}}>  
            <p style={{fontSize:'20px'}}>查询航班数据共<b>{arrayLength}</b>条</p>
          </div>
        </div>
      </div>
    )
   
    }
}

class App extends Component {
  constructor(props){
    super(props)
    this.state={arr:[]}
   }
  
  componentDidMount() {
    this.props.dispatch(wrapTo('map1', addDataToMap({datasets: sampleData2019,config})));
    console.log(sampleData2019.data.rows.map(v=>v))
  }

  _getMapboxRef = (mapbox, index) => {
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      console.log(`Map ${index} has closed`);
    } else {
      // We expect an InteractiveMap created by KeplerGl's MapContainer.
      // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
      const map = mapbox.getMap();
      //console.log(map);
      window.addEventListener("click", (e) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // console.log(windowWidth,windowHeight);
        const bound = map.getBounds();
        const lng = bound._sw.lng + e.clientX * (bound._ne.lng - bound._sw.lng)/windowWidth;
        let temp = 0;
        if (lng > 180) {
          temp = lng - 360;
        } 
        else{
          temp = lng;
        }
        const mouselng = temp;
        const mouselat = bound._sw.lat + (windowHeight - e.clientY) * (bound._ne.lat - bound._sw.lat)/windowHeight;
         
        // console.log(mouselng,mouselat);
        if (store.getState().app.Query_flights){
          console.log(this.setState({arr:filterData(sampleData2019.data.rows,mouselng,mouselat)}))
          // 更新mouselng为newValue1
          store.dispatch(updateMouselng(mouselng));
          // 更新mouselat为newValue2
          store.dispatch(updateMouselat(mouselat));
        }
        // console.log(store.getState().app);

      });
    }
  };

  handleClick = () => {
    store.dispatch(updateQueryflights(!(store.getState().app.Query_flights)));
    // console.log(store.getState().app.Query_flights);
  };

  render() {
    const mouselng = store.getState().app.mouselng;
    const mouselat = store.getState().app.mouselat;
    var {arr}=this.state
    return (
      <div>
        <div style={{
              //transition: "margin 1s, height 1s",
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <KeplerGl
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  id="map1"
                  /*
                    * Specify path to keplerGl state, because it is not mount at the root
                    */
                  // getState={keplerGlGetState}
                  getMapboxRef={this._getMapboxRef}
                  width={width}
                  height={height}
                />
              )}
            </AutoSizer>
           {/* <StyledMapConfigDisplay>
              {this.props.app.mapConfig
              ? JSON.stringify(this.props.app.mapConfig)
              : 'Click Save Config to Display Config Here'}
            </StyledMapConfigDisplay> */}
        </div>
        <div>
          {/* 右侧按钮 */}
          <div aria-expanded="true">  
            <div style={{
              transition: "margin 1s, height 1s",
              position: "absolute",
              right:60,
              top: 67,
              backgroundColor: 'rgb(40,49,59)',
              width:"32px",height:"20px",
            }}
            >
              <button 
              style={{
                transition: "margin 1s, height 1s",
                position: "absolute",
                right:-10,
                top:-2,
                color:'rgb(106,116,133)',
                backgroundColor: 'rgb(40,49,59)',
                width:"80px",height:"32px",
              }}
              onClick={this.handleClick}>查询航班</button>
            </div>
          </div>
          <Epie arr={arr}></Epie>
          <Eline  arr={arr}></Eline>
          <From  arr={arr}></From>
        </div>
        {/* 题目 */}
        <div>
          <p style={{
            transition: "margin 1s, height 1s",
            position: "absolute",
            fontSize:25,
            left:450,
            top:-20,
            textAlign:'center',
            color:'#F5F5F5',
            textShadow: '1px 1px 0 #00f',
            fontWeight:'bold',
          }}>航空客运班次交互式查询地图——以美国本土为例</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
