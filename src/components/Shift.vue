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
        <el-col :span="2" >
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
                <template v-for="shift in shiftTable">
                  <div v-if="(shift.TimePeriod == period.timePeriodIndex && shift.Weekday == weekDay)"
                       class="singleShift">
                    <el-dropdown trigger="click" >
                      <el-button type="" text style="margin-top: 5px">{{ shift.Name }}</el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>

                            <el-dropdown placement="bottom-start">
                              换班
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item>Action 1</el-dropdown-item>
                                  <el-dropdown-item>Action 2</el-dropdown-item>
                                  <el-dropdown-item>Action 3</el-dropdown-item>
                                  <el-dropdown-item>Action 4</el-dropdown-item>
                                  <el-dropdown-item>Action 5</el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
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
    timePeriodIndex: 1,
    timePeriod: "10:00~12:00",
  },
  {
    timePeriodIndex: 3,
    timePeriod: "14:00~14:00",
  },
  {
    timePeriodIndex: 4,
    timePeriod: "16:00~18:00",
  },
  {
    timePeriodIndex: 5,
    timePeriod: "18:00~21:00",
  },
];

let weekDayList = [0, 1, 2, 3, 4, 5, 6];
let shiftTable = ref(['']);

let showingWeek = ref(12);

function getWeekShift(week: number) {
  var config = {
    method: "get",
    url: "/portalApi/getWeekShift?week=" + showingWeek.value,
  };

  axios(config)
      .then(function (response) {
        shiftTable.value = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
}

function getLastWeekShift() {
  showingWeek.value--;
  getWeekShift(showingWeek.value)
}

function getNextWeekShift() {
  showingWeek.value++;
  getWeekShift(showingWeek.value)
}

getWeekShift(showingWeek.value);


</script>

<style scoped>
.weekTable {
  width: 1300px;
  display: table;
}

.timePeriod{
  padding-top: 18px;
  vertical-align: middle;
  display: table-cell;
}

.shift {
  width: 100px;
  height: 80px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  margin-top: 5px;
  margin-left: 5px;
}
</style>
