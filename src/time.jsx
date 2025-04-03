import React from 'react';

export class Time {
  static NewfromString(str) {
    return new StringToTime(str);
  }

  static ReBound(time) {
    while(time.second < 0) {
      time.minute = time.minute - 1;
      time.second = time.second + 60;
    }
    while(time.second > 59) {
      time.minute = time.minute + 1;
      time.second = time.second - 60;
    }
    while(time.minute < 0) {
      time.hour = time.hour - 1;
      time.minute = time.minute + 60;
    }
    while(time.minute > 59) {
      time.hour = time.hour + 1;
      time.minute = time.minute - 60;
    }
  }

  static StringToTime(str) {
    var item = {
      hour: 0,
      minute: 0,
      second: 0
    };
    var nums = str.split(" ");
    
    if (nums.length > 1) {
      item["day"] = nums[0];
      nums = nums[1].split(":");
    }
    else {
      nums = nums[0].split(":");
    }

    item.hour = parseInt(nums[0]);
    item.minute = parseInt(nums[1]);
    item.second = parseInt(nums[2]);

    return item;
  }
  
  static TimeToString(time) {
    var s = "";
    if (Object.keys(time).indexOf("day") > -1) {
      s = s + time.day + " ";
    }
    s = s + time.hour + ":";
    s = s + (time.minute < 10 ? "0" : "") + time.minute + ":";
    s = s + (time.second < 10 ? "0" : "") + time.second;
    return s;
  }

  static Comparison(time, other) {
    var p1 = time;
    if (typeof(p1) === "string") {
      p1 = Time.StringToTime(p1);
    }
    if (Object.keys(p1).indexOf("day") > -1 ) {return false;}
    p1 = parseInt(p1.hour) * 3600 + parseInt(p1.minute) * 60 + parseInt(p1.second);
    var p2 = other;
    if (typeof(p2) === 'string') {
      p2 = Time.StringToTime(p2);
    }
    if (typeof(p2) === 'object') {
      console.log("is obj");
      if (Object.keys(p2).indexOf("day") > -1) {return false;}
      p1 = p2.hour * 3600 + p2.minute * 60 + p2.second;
    }
    console.log(p1 + " | " + p2);
    return p1 > p2;
  }

  static Arithmatic(time, other) {
    var p1 = time;
    if (typeof(p1) === "string") {
      p1 = Time.StringToTime(p1);
    }
    var p2 = other;
    if (typeof(p2) === 'string') {
      p2 = Time.StringToTime(p2);
    }
    var ret = {};
    if (typeof(p2) === 'object') {
      console.log("is obj");
      if (Object.keys(p1).indexOf("day") > -1) {
        ret["day"] = p1.day;
      }
      ret["hour"] = p1.hour + p2.hour;
      ret["minute"] = p1.minute + p2.minute;
      ret["second"] = p1.second + p2.second;
    }
    else {
      ret = p1;
      ret.second = ret.second + p2;
    }
    this.ReBound(ret);
    return ret;
  }
}