<template>
  <view class="content">
    <view class="date__top">
      <view class="date__times">{{ times }}</view>
	  <view  @click="getTimes">当前月</view>
    </view>
    <view class="days__box">
      <view
        class="days__item"
        v-for="(item, index) in days_items"
        :key="index"
        >{{ item }}</view
      >
    </view>
    <view class="date__box" @touchstart="moveStart" @touchend="moveEnd"> <!-- 手指左右滑动 @touchstart="moveStart" @touchend="moveEnd" -->
      <view class="back__box">
        <view
          class="date__back"
          v-for="(item, index) in 35"
          :key="index"
        ></view>
      </view>
      <view class="date__items" v-for="(item, index) in day_list" :key="index"
        ><view>{{ item.time }}</view>
        <view class="point__box" v-if="item.dataList && item.dataList.length > 4">
          <view
            class="point__item"
            v-for="(item_point, index_point) in 3"
            :key="index_point"
            c
          ></view>
        </view>
        <view
          class="date__actions"
          v-for="(items, indexs) in item.dataList"
          v-if="items.index < 4"
          :key="indexs"
          :style="{
            backgroundColor: items.color,
            width: items.is_frist ? items.width + 'px' : '102%',
            top: (items.index + 1) * 20 + 'px',
            zIndex: items.is_frist ? 100 : 10,
            borderRadius: items.is_frist ? 24 + 'rpx' : 0,
            borderTopRightRadius: items.is_end ? 24 + 'rpx' : 0,
            borderBottomRightRadius: items.is_end ? 24 + 'rpx' : 0,
          }"
          ><span v-if="items.is_frist" style="margin-left: 4px;">{{ items.desc }}</span></view
        ></view
      >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      show: true,
      times: '',
      days_items: ['日', '一', '二', '三', '四', '五', '六'],
      day_list: [], // 格子的数量
    }
  },
  watch: {
    list(val) {
      this.getCurrentMouthsDays(this.years, this.month)
    },
  },
  created() {
    const res = uni.getSystemInfoSync()
    this.windowWidth = res.windowWidth
    this.getTimes()
	let rq = this.years + '-' + this.month
	this.$emit('getCurrentTime', rq)
  },
  methods: {
    getTimes() {
      this.day_list = []
      const myDate = new Date()
      const tYear = myDate.getFullYear()
      const tMonth = myDate.getMonth()
      const m = tMonth + 1
      if (m.toString().length == 1) {
        m = '0' + m
      }
      this.years = tYear
      this.month = m
      this.times = tYear + '年' + m + '月'
      this.current_time = tYear + '-' + m
      this.getCurrentMouthsDays(tYear, tMonth + 1)
    },
    // 获取当前月总共有多少天
    getCurrentMouthsDays(year, month) {
      const d = new Date(year, month, 0)
      const days = d.getDate()
      this.$all_days = days
      this.getOneDaye(year, month)
    },
    // 获取当前月01号是星期几 
    getOneDaye(year, month) {
      const myDate = new Date(`${year}/${month}/01`)
      const $index = myDate.getDay()
      const $arr = Array.apply(null, { length: 42 })
      let $times = 0
      $arr.forEach((i, index) => {
        if (index >= $index) {
          $times++
          // if ($times <= this.$all_days) this.day_list.push({ time: $times }) 
          if ($times <= this.$all_days) this.day_list[index]={ time: $times }
          else this.day_list.push({})
        } else {
          this.day_list.push({})
        }
      })
	  this.day_list = this.day_list.slice(0,42) //良坤加了这句
      this.fillForm()
    },
    // 获取数据渲染计划列表
    fillForm() {
      //$data_index 记录每一条数据最开始的位置的index
      // is_frist 判断是不是开始的第一条数据
      const sortArr = (a, b) => {
        return a.start - b.start
      }
      // 不会改变现有的数组，而仅仅会返回被连接数组的一个副本 防止watch loop
      const arr = [].concat(this.list)
      const $list = arr.sort(sortArr)
	  let year = this.years
	  let month = this.month
      this.day_list.forEach((el, index) => {
        $list.forEach((i, indexs) => {
          if (!i) return
          if (el.time >= i.start && el.time <= i.end) {
            const $obj = {}
            $obj.color = i.color
            $obj.desc = i.desc
            if (el.time == i.start) {
              $obj.index = el.dataList ? el.dataList.length : 0
              i.$data_index = $obj.index
            } else {
              $obj.index = i.$data_index
            }
            $obj.width =
              (
                ((Number(i.end) - Number(i.start) + 1) * this.windowWidth) /
                7
              ).toFixed(2) - 30
            // 判断是否是每条计划的开始
            if (el.time == i.start) {
              $obj.is_frist = true
            } else {
              $obj.is_frist = false
            }
            // 判断是否是每条计划的结束
            if (el.time == i.end) {
              $obj.is_end = true
            } else {
              $obj.is_end = false
            }
            el.dataList = el.dataList ? el.dataList : [],
            el.dataList.push($obj)
          }
        })
      })
    },
    // 改变日期
    changeDate(type) {
      this.day_list = []
      if (!type) {
        // 减去日期  type=0
        if (this.month - 1 < 1) {
          this.years--
          this.month = 12
        } else {
          this.month--
        }
      } else {
        // 增加日期 type=1
        if (this.month + 1 > 12) {
          this.years++
          this.month = 1
        } else {
          this.month++
        }
      }
      this.times = this.years + '年' + this.month + '月'
      this.current_time = this.years + '-' + this.month
      this.getCurrentMouthsDays(this.years, this.month)
      this.$emit('getCurrentTime', this.current_time)
    },
    // 记录点击开始位置
    moveStart(e) {
      this.startX = e.changedTouches[0].pageX
    },
    moveEnd(e) {
      const $endX = e.changedTouches[0].pageX
      if ($endX - this.startX >= 50) {
        this.changeDate(0)
      } else if (this.startX - $endX >= 50) {
        this.changeDate(1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.date__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 36rpx;
  color: #0d1a2d;
  font-weight: bold;
  padding: 30rpx;
  margin: 10rpx 0 30rpx 0;
}
.days__box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  .days__item {
    width: 14.28%;
    text-align: center;
  }
}
.date__box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background-color: white;
  flex-wrap: wrap;
  .back__box {
    background-color: white;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    .date__back {
      width: 14%;
      border-top: 1rpx solid #e7e9ea;
      border-left: 1rpx solid #e7e9ea;
      height: 220rpx;
      position: relative;
      z-index: 2;
    }
  }
  .date__items {
    width: 14%;
    border-top: 1rpx solid #e7e9ea;
    border-left: 1rpx solid #e7e9ea;
    height: 220rpx;
    position: relative;
    .point__box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: absolute;
      bottom: 10rpx;
      left: 0;
      .point__item {
        width: 9rpx;
        height: 9rpx;
        background: #f78739;
        border-radius: 50%;
        margin-right: 5rpx;
      }
    }
  }
  .date__actions {
    font-size: 20rpx;
    color: #fff;
    white-space: nowrap;
    position: absolute;
    left: 0;
    height: 28rpx;
  }
}
.add__plan {
  width: 110rpx;
  height: 110rpx;
  background: #ffffff;
  box-shadow: 0 0 18rpx 0 rgba(19, 32, 62, 0.35);
  border-radius: 50%;
  position: fixed;
  bottom: 100rpx;
  right: 20rpx;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .iconjia-01 {
    font-size: 60rpx;
  }
}
</style>
 