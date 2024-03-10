import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/models/server-data-response';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { DatePipe } from '@angular/common';
import { ITaskProgress } from 'src/app/models/monthly-task.interface';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-progress-view',
  templateUrl: './progress-view.component.html',
  styleUrls: ['./progress-view.component.css']
})
export class ProgressViewComponent implements OnInit {
  public isSidebarOpen = true;
  public progressView: ITaskProgress[] = [];
  constructor(private WS: WebService, private toastr: ToastrService, private datepipe: DatePipe) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getMonthTaskData(this.datepipe.transform(new Date(), 'yyyy-MM'));

    setTimeout(() => {
      this.viewProgreeGraph();
    }, 5000)
  }

  currentDay(): number {
    return new Date().getDate()
  }

  public viewProgreeGraph(): void {
    this.createGraph(30)
  }

  public getMonthTaskData(monthYear: any): void {
    this.WS.post('api/master/monthly/task/get', { monthYear }).subscribe((res: IResponse) => {
      if (res.status === 1) {
        this.progressView = res.result.progress as ITaskProgress[]
        this.toastr.success(res.description);
      } else if (res.status === 2) {
        this.toastr.info(res.description);
      } else {
        this.toastr.error(res.description);
      }
    });
  }

  public daysInMonth(month: string) {
    const date = new Date(month);
    return new Date(date.getFullYear(),
      date.getMonth() + 1,
      0).getDate();
  }

  private createGraph(days: number): void {
    const today = this.currentDay();
    const startDay = today - days;

    let preMonthData: ITaskProgress[] = []

    let daysIteration = []
    /**
     * This condition will validate whether the days falls under previous month
     * if that is true we will get previous month data to progress
     */
    if (startDay < 0) {
      let preMonth: any = new Date().getMonth()
      let year = new Date().getFullYear()
      if (preMonth < 0) {
        year = year - 1
      }
      if (preMonth < 10) {
        preMonth = '0' + preMonth
      }
      this.WS.post('api/master/monthly/task/get', { monthYear: year + '-' + preMonth }).subscribe((res: IResponse) => {
        if (res.status === 1) {
          preMonthData = res.result.progress as ITaskProgress[]
          // this.toastr.success(res.description);
        }
      });

      let preMonthDays = this.daysInMonth(preMonth)
      while (days !== 0) {
        const today = this.currentDay();
        const dayDiference = today - days;
        if (preMonthData.length && dayDiference < 0) {
          for (const view of this.progressView) {
            let pushObj: any = {}
            pushObj.habitName = view.habitName;
            pushObj.dayMonth = preMonthDays - dayDiference + '-' + preMonth + '-' + year

            let count = 0
            for (let i = preMonthDays - dayDiference; i <= preMonthDays; i++) {
              if (view.progress[i].isSelected) {
                count = count + 1
              }
            }
            pushObj.count = count
            daysIteration.push(pushObj)
            days--
          }

          // taskDayCount.push(count)
        } else {
          for (const view of this.progressView) {
            let pushObj: any = {}
            pushObj.habitName = view.habitName;
            pushObj.dayMonth = preMonthDays - days + '-' + new Date().getMonth() + 1 + '-' + year

            // if (days > 1) {
            let count = 0
            for (let i = 1; i <= today; i++) {
              if (view.progress[i].isSelected) {
                count = count + 1
              }
            }
            pushObj.count = count
            daysIteration.push(pushObj)

            // }
          }
          days = 0
        }
      }

    } else {
      let currenMonth: any = new Date().getMonth()
      let year = new Date().getFullYear()

      for (const view of this.progressView) {
        if (days > 1) {
          let count = 0
          let pushObj: any = {}
          pushObj.habitName = view.habitName;
          pushObj.dayMonth = startDay + '-' + currenMonth + 1 + '-' + year
          for (let i = startDay + 1; i <= today; i++) {
            if (view.progress[i].isSelected) {
              count = count + 1
            }
          }
          pushObj.count = count
          daysIteration.push(pushObj)
        }
      }
    }

    /**
     * Code to destructure the array to get label and count for the chart
     */
    const chartLabels = []
    const taskDayCount = []

    for (const view of daysIteration) {
      chartLabels.push(view.habitName)
      taskDayCount.push(view.count)
    }


    /**
     * Randomize the color and boundries for chart if values are large
     */

    const chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'My First Dataset',
          barPercentage: 30,
          barThickness: 30,
          maxBarThickness: 30,
          minBarLength: 30,
          data: taskDayCount,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart'
          }
        }
      }
    });

  }

}
