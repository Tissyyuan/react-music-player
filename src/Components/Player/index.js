import React, { Component } from 'react'
import cd from '../../assets/cd.svg'
import '../../assets/player-control-iconfont/iconfont.css'
import './index.less'

class Player extends Component {
  state = {
    isplay: false,
    list: this.props.musiclist,
    seleted: 0,
    seletedTimeDuration: 1,
    seletedCurrentTime: 0,
  }

  // 暂停
  pause = () => {
    this.refs.audio.pause();
    this.setState({isplay: false});
    this.props.togglePlayStatus(true);
  }

  // 播放
  play = () => {
    this.refs.audio.play();
    this.setState({isplay: true});
    this.props.togglePlayStatus(false);
  }

  // 切换播放状态
  togglePlayStatus = () => {
    this.state.isplay?this.pause():this.play();
  }

  // 下一首
  toggle_next = () => {
    if(this.state.seleted < (this.state.list.length - 1)){
      this.setState(prevState => ({seleted: (prevState.seleted + 1)}));
    } else {
      this.setState({seleted: 0});
    }
  }

  // 上一首
  toggle_prev = () => {
    if(this.state.seleted > 0){
      this.setState(prevState => ({seleted: (prevState.seleted - 1)}));
    } else {
      this.setState({seleted: (this.state.list.length - 1)});
    }
  }

  // 添加绑定事件
  add_event = () => {
    // 音频结束事件
    this.refs.audio.onended = () => {this.toggle_next()};
    // 音频时间改变事件
    this.refs.audio.ondurationchange = () => {
      this.setState({ seletedTimeDuration: this.refs.audio.duration});
    }
    // 音频播放位置改变事件
    this.refs.audio.ontimeupdate = () => {
      this.setState({ seletedCurrentTime : this.refs.audio.currentTime});
    }
    // 音频就绪事件
    this.refs.audio.oncanplay = () => {
      if(this.state.isplay){
        this.refs.audio.play();
      }
    }
    // 进度条点击事件
    this.refs.progressbarbg.onclick = e => {
      const { seletedTimeDuration } = this.state;
      const pbgobj = this.refs.progressbarbg.getBoundingClientRect();
      const newSeletedCurrentTime = (e.clientX - pbgobj.left) / (pbgobj.right - pbgobj.left) * seletedTimeDuration;
      this.refs.audio.currentTime = newSeletedCurrentTime;
      this.setState({ seletedCurrentTime: newSeletedCurrentTime });
    }
    this.refs.progressbarcurrent.onclick = e => {
      this.refs.progressbarbg.onclick(e);
    }
  }

  componentDidMount = () => {
    this.add_event();
  }
  
  sec_to_time = function(s) {
    var t = '';
    if(s > -1){
        // var hour = Math.floor(s/3600);
        var min = Math.floor(s/60) % 60;
        var sec = s % 60;
        // if(hour < 10) {
        //     t = '0'+ hour + ":";
        // } else {
        //     t = hour + ":";
        // }

        if(min < 10){t += "0";}
        t += min + ":";
        if(sec < 10){t += "0";}
        t += sec.toFixed(0);
    }
    console.log(t);
    return t;
  }

  render() {
    const { isplay, list, seleted, seletedTimeDuration, seletedCurrentTime } = this.state;
    const currentProgress = ( seletedCurrentTime / seletedTimeDuration ) * 100 + "%";
    return (
      <div>
        <audio src={list[seleted].url} preload="auto" ref="audio"></audio>
        <div className="playermain">
          <div className="infobackground">
            <div className="info"> 
              <img src={cd} className={"cd" + (isplay?"":" cdpaused")} alt="cd" />
              <div className="details">
                <div className="name">{list[seleted].name}</div>
                <div className="artist">{list[seleted].artist}</div>
              </div>
            </div>
          </div>

          <div className="progressbar">
            <svg>
              <text x="1" y="15" fill="#666666" font-size="0.8em">{ this.sec_to_time(seletedCurrentTime) }</text>
              <text x="341" y="15" fill="#666666" font-size="0.8em" text-anchor="end">{ this.sec_to_time(seletedTimeDuration) }</text>
              <rect y="20" width="100%" height="10" fill="#ccc" rx="3" ry="5" ref="progressbarbg"></rect>
              <rect y="20" width={ currentProgress } height="10" fill="#666666" rx="3" ry="5" ref="progressbarcurrent"></rect>
            </svg>
          </div>
        </div>

        <div className="playcontrols">
          <i onClick={this.toggle_prev} className="icon iconfont icon-prev"></i>
          <i onClick={this.togglePlayStatus} className={"icon iconfont icon-" + (isplay?"pause":"play")}></i>
          <i onClick={this.toggle_next} className="icon iconfont icon-next"></i>
        </div>

      </div>
    );
  }
}

export default Player;