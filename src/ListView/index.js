import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import { virtualize } from "react-swipeable-views-utils";
import Masonry, { dataTransfer } from "@ozo/masonry";
import ReactLoading from "react-loading";
import {
  cols,
  gutter,
  maxHeight,
  lazyLoadProps,
  viewWidth,
  viewHeight,
  addHeight,
  getElements
} from "./data";

import "./index.scss";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const TabPanelStyles = {
  slide: {
    display: "flex",
    height: "100%",
    color: "#fff"
  },
  slide1: {
    background: "#FEA900"
  },
  slide2: {
    background: "#B3DC4A"
  },
  slide3: {
    background: "#6AC0FF"
  },
  slide4: {
    background: "#FEA9FF"
  },
  slide5: {
    background: "#A3DC4A"
  },
  slide6: {
    background: "#9A60FF"
  },
  slide7: {
    background: "#AAC0FF"
  }
};

const tabs = [
  { id: 1, label: "经典", value: "1", count: 10 },
  { id: 2, label: "流行", value: "2", count: 20 },
  { id: 3, label: "复古", value: "3", count: 30 },
  { id: 4, label: "怀旧", value: "4", count: 25 },
  { id: 5, label: "摇滚", value: "5", count: 15 },
  { id: 6, label: "乡村", value: "6", count: 20 },
  { id: 7, label: "蓝调", value: "7", count: 10 }
];

const Loading = ({
  className = "bottom",
  size = 24,
  type = "spin",
  color = "#69f"
}) => (
  <div className={`loadingWrap ${className}`}>
    <ReactLoading type={type} color={color} height={size} width={size} />
  </div>
);

class ListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentTabIndex: 0,
      cols,
      gutter,
      renderType: "position",
      virtualized: true,
      lazyLoadProps,
      maxHeight,
      initLoading: false,
      loading: false
    };
    this.data = [];
    this.getDataLock = false;
    this.initDAtaLock = false;
  }
  componentDidMount() {
    console.log("--- componentDidMount ---");
    this.initData(this.data[this.state.currentTabIndex]);
  }
  calcData = async (arr, isForce = false) => {
    const { cols, gutter, renderType, maxHeight, currentTabIndex } = this.state;
    const tStartTime = performance.now();

    this.data[currentTabIndex] = arr;
    dataTransfer(arr, {
      cols,
      gutter,
      viewWidth,
      viewHeight,
      addHeight,
      maxHeight,
      renderType,
      force: isForce
    }).then(data => {
      this.getDataLock = false;
      this.initDAtaLock = false;

      let tData = [...this.state.data];
      tData.splice(this.state.currentTabIndex, 1, data);
      this.setState({
        data: tData
      });

      console.log(`dataTransfer：`, performance.now() - tStartTime);
    });
  };
  initData = data => {
    if (data) {
      this.calcData(data);
      return;
    }
    if (!this.initDAtaLock) {
      this.initDAtaLock = true;
      this.setState({ initLoading: true });

      this.getData(tabs[this.state.currentTabIndex].count, true).then(res => {
        this.calcData(res);
      });
    }
  };
  loadMore = () => {
    if (!this.getDataLock) {
      this.getDataLock = true;
      this.setState({ loading: true });

      this.getData().then(res => {
        const tArr = this.data[this.state.currentTabIndex].concat(res);
        this.calcData(tArr);
      });
    }
  };
  getData = (num = 20, isInit = false) => {
    const tData = this.data[this.state.currentTabIndex];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          getElements({
            num,
            start: tData ? tData.length : 0
          })
        );
      }, 2000);
    }).then(res => {
      if (isInit) {
        this.setState({ initLoading: false });
      } else {
        this.setState({ loading: false });
      }

      return res;
    });
  };
  handleTabChange = (e, currentTabIndex) => {
    console.log("handleTabChange:", currentTabIndex);
    this.setState({ currentTabIndex });
  };
  handleChangeIndex = currentTabIndex => {
    console.log("handleChangeIndex:", currentTabIndex);
    this.setState({ currentTabIndex });
  };
  handleTransitionEnd = () => {
    this.initData(this.data[this.state.currentTabIndex]);
  };
  handleClick = (id, item, e) => {
    console.log(id, item, e);
  };
  handleScroll = e => {
    const { clientHeight, scrollTop, scrollHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight) {
      this.loadMore();
    }
  };
  slideRenderer = params => {
    const {
      data,
      currentTabIndex,
      cols,
      gutter,
      renderType,
      virtualized,
      lazyLoadProps
    } = this.state;
    const { index, key } = params;
    return (
      <div
        key={key}
        style={Object.assign(
          {},
          TabPanelStyles.slide,
          TabPanelStyles[`slide${index + 1}`]
        )}
      >
        <Masonry
          key={`masonry-${key}`}
          name={`masonry-${key}`}
          theme="flat"
          data={data[currentTabIndex]}
          renderType={renderType}
          virtualized={virtualized}
          maxScreen={6}
          cols={cols}
          gutter={gutter}
          lazyLoadProps={lazyLoadProps}
          onScroll={this.handleScroll}
          onClick={this.handleClick}
        />
      </div>
    );
  };
  currentTotal = index => {
    const { currentTabIndex } = this.state;

    return index === currentTabIndex && this.data[currentTabIndex]
      ? this.data[currentTabIndex].length
      : this.data[index]
      ? this.data[index].length
      : 0;
  };
  render() {
    const {
      data,
      currentTabIndex,
      cols,
      gutter,
      renderType,
      virtualized,
      lazyLoadProps,
      loading,
      initLoading
    } = this.state;
    return (
      <div className="listView">
        <AppBar position="static" color="default">
          <Tabs
            value={currentTabIndex}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={tabs.length >= 5 ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            aria-label="scrollable auto tabs"
          >
            {tabs.map((item, index) => {
              const { id, label } = item;
              return (
                <Tab
                  key={id}
                  id={id}
                  label={`${label}(${this.currentTotal(index)})`}
                />
              );
            })}
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={currentTabIndex}
          onChangeIndex={this.handleChangeIndex}
          onTransitionEnd={this.handleTransitionEnd}
          containerStyle={{ height: viewHeight }}
          slideStyle={{ height: "100%" }}
          threshold={2}
        >
          {tabs.map((item, index) => {
            const { id } = item;
            return (
              <div
                key={id}
                style={Object.assign(
                  {},
                  TabPanelStyles.slide,
                  TabPanelStyles[`slide${index + 1}`]
                )}
              >
                <Masonry
                  name={`masonry-${id}`}
                  theme="flat"
                  data={data[currentTabIndex]}
                  renderType={renderType}
                  virtualized={virtualized}
                  maxScreen={6}
                  cols={cols}
                  gutter={gutter}
                  lazyLoadProps={lazyLoadProps}
                  onScroll={this.handleScroll}
                  onClick={this.handleClick}
                />
              </div>
            );
          })}
        </SwipeableViews>

        {/* <VirtualizeSwipeableViews
          index={currentTabIndex}
          onChangeIndex={this.handleChangeIndex}
          onTransitionEnd={this.handleTransitionEnd}
          containerStyle={{ height: viewHeight }}
          slideStyle={{ height: "100%" }}
          slideCount={tabs.length}
          slideRenderer={this.slideRenderer}
          threshold={2}
        /> */}
        {initLoading ? (
          <Loading key="initDataLoading" className="up" size={32} />
        ) : null}
        {loading ? <Loading key="loadMoreLoding" className="bottom" /> : null}
      </div>
    );
  }
}

export default ListView;
