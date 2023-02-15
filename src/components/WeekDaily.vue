<template>

  <div class="weekTable">
    <el-button type="primary" :icon="ArrowLeft" @click="getLastWeekShift">上一周</el-button>
    <span> 当前周{{ showingWeek }}</span>
    <el-button type="primary" @click="getNextWeekShift">下一周
      <el-icon class="el-icon--right">
        <ArrowRight/>
      </el-icon>
    </el-button>
    <div class="timePeriodList">
      <el-row class="timePeriodRow" v-for="(period, period_index) in timePeriodList">
        <el-col :span="2">
          <div class="timePeriod">
            {{ period.timePeriod }}
          </div>
        </el-col>
        <template v-if="timePeriodList.length > 0">
          <el-col :span="2" v-for="weekDay in weekDayList">
            <div class="row_day" v-if="period_index===0">
              {{ weeks[weekDay] }}
            </div>
            <div class="timePeriod_col">
              <div class="shift">
                <template v-for="OT in OccupationTable">
                  <div v-if="(OT.TimePeriod == period.timePeriodIndex && OT.Weekday == weekDay)"
                       class="singleShift">
                    <el-dropdown trigger="click" >
                      <el-button type="" text style="margin-top: 5px">{{ OT.Event }}</el-button>
                      <h5> {{ OT.Place }}</h5>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            详细信息
                          </el-dropdown-item>
                          <el-dropdown-item command="b">请假</el-dropdown-item>
                          <el-dropdown-item command="c" divided>置空</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </template>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>

  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import {watch, reactive, ref} from "vue";
import {
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'

const weeks = [
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日",
];

const timePeriodList = [
  {
    timePeriodIndex: 0,
    timePeriod: "8:00~9:35",
  },
  {
    timePeriodIndex: 1,
    timePeriod: "9:55~11:30",
  },
  {
    timePeriodIndex: 2,
    timePeriod: "11:40~13:15",
  },
  {
    timePeriodIndex: 3,
    timePeriod: "14:00~15:35",
  },
  {
    timePeriodIndex: 4,
    timePeriod: "15:55~17:30",
  },
  {
    timePeriodIndex: 5,
    timePeriod: "18:40~20:15",
  },
  {
    timePeriodIndex: 6,
    timePeriod: "20:25~22:00",
  },
];

let weekDayList = [0, 1, 2, 3, 4, 5, 6];
let OccupationTable = ref(['']);

let showingWeek = ref(12);

interface OccuapationTable {
  UserID: string,
  Week: number,
  Weekday: number,
  TimePeriod: number,
  Event: string,
  Place: string,
  Status: boolean,
}

function getWeekOT(week: number) {
  var config = {
    method: "get",
    url: "/portalApi/getOccupationTable?week=" + showingWeek.value,
  };

  axios(config)
      .then(function (response) {
        OccupationTable.value = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
}

function getLastWeekShift() {
  showingWeek.value--;
  getWeekOT(showingWeek.value)
}

function getNextWeekShift() {
  showingWeek.value++;
  getWeekOT(showingWeek.value)
}

getWeekOT(showingWeek.value);

function getShiftTable() {
  console.log(OccupationTable);
}

</script>

<style scoped>
.weekTable {
  width: 1500px;
}

.timePeriod {
  padding-top: 30px;
}

.shift {
  width: 120px;
  height: 80px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  margin-top: 8px;
  margin-left: 5px;
}
</style>
