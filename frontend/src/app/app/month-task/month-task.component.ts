import { DatePipe, formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { } from '@angular/core'
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { IMonthlyTask, ITaskProgress } from '../models/monthly-task.interface';
import { IResponse } from '../models/server-data-response';
import { WebService } from '../services/web.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-month-task',
  templateUrl: './month-task.component.html',
  styleUrls: ['./month-task.component.css']
})

export class MonthTaskComponent implements OnInit {
  public isSidebarOpen = true;
  public seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  private month = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];

  public currentMonth: any;
  public dataSource!: MatTableDataSource<any>;
  public displayedColumns: string[] = ['habitName'];
  public columnsToDisplay: string[] = [];
  public addNewRow: FormGroup = new FormGroup({ habitName: new FormControl(''), progress: new FormGroup({}) });
  public trackerData: any[] = []
  public selectedTheme = '';
  public currentDay = 0;
  public formSave!: FormGroup;
  public saveMonthlyTask: IMonthlyTask = {
    _id: '',
    monthYear: '',
    habit: [],
    selectedTheme: '',
    goals: '',
    notes: '',
  }
  public taskProgress: ITaskProgress[] = [];

  constructor(private datepipe: DatePipe, private WS: WebService,
    private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    const mon = new Date().getMonth();
    this.currentDay = new Date().getDate();
    this.formSave = new FormGroup({
      data: new FormArray([])
    })

    console.log(this.formSave, this.formSave.value);

    // console.log(this.currentDay)
    this.currentMonth = this.datepipe.transform(new Date(), 'yyyy-MM');

    const days = this.daysInMonth(this.currentMonth)
    // this.currentMonth = this.month[mon];
    this.selectedTheme = this.seasons[0];
    this.createMonthColumn(days);
    // this.createDemoData();
    this.getMonthTaskData();
    this.createNewRow();
  }

  public createMonthColumn(days: number): void {
    for (let i = 1; i <= days; i++) {
      this.displayedColumns.push(`${i}`);
    }
    this.columnsToDisplay = this.displayedColumns.slice();
  }

  public daysInMonth(month: string) {
    const date = new Date(month);
    return new Date(date.getFullYear(),
      date.getMonth() + 1,
      0).getDate();
  }

  // public createNewRow(): void {
  //   for (let j = 0; j < this.displayedColumns.length; j++) {
  //     if (this.checkTypeOfInput(this.displayedColumns[j])) {
  //       this.addNewRow.habitName = ''
  //     } else {
  //       this.addNewRow.progress[this.displayedColumns[j]] = { isSelected: false }
  //     }
  //   }
  //   // console.log(this.addNewRow)
  //   // this.formSave.setValue({ data: this.addNewRow });
  // }


  public createNewRow(): void {
    for (let j = 0; j < this.displayedColumns.length; j++) {
      if (this.checkTypeOfInput(this.displayedColumns[j])) {
        // this.addNewRow.habitName = ''
      } else {
        (this.addNewRow.controls['progress'] as FormGroup).setControl(this.displayedColumns[j], new FormGroup({ isisSelected: new FormControl(false) }))
      }
    }
    console.log(this.addNewRow)
    // this.formSave.setValue({ data: this.addNewRow });
  }

  get habits(): any {
    return <FormArray>this.formSave.get('data');
  }
  public addRow(): void {
    let group = new FormGroup({})
    // const lessonForm = 
    // console.log(lessonForm.value)
    // this.taskProgress.push(this.addNewRow);
    this.habits.push(this.addNewRow)
    console.log(this.formSave.value)
    this.dataSource = new MatTableDataSource(this.habits);
  }

  public checkTypeOfInput(colValue: string): boolean {
    return isNaN(parseInt(colValue));
  }

  // public createDemoData(): void {
  //   // this.trackerData = [];
  //   // const objectMap = this.displayedColumns.reduce((acc: any, curr) => (acc[curr] = '', acc), {});
  //   for (let i = 0; i < 5; i++) {
  //     let element: any = { _id: `abc${i}` }
  //     for (let j = 0; j < this.displayedColumns.length; j++) {
  //       if (this.checkTypeOfInput(this.displayedColumns[j])) {
  //         element[this.displayedColumns[j]] = 'Demo'
  //       } else {
  //         element[this.displayedColumns[j]] = {
  //           isSelected: false
  //         }
  //       }
  //     }
  //     this.trackerData.push(element)
  //   }

  //   this.dataSource = new MatTableDataSource(this.trackerData);
  // }

  public disableCheckbox(val: string): boolean {
    return this.currentDay !== parseInt(val)
  }

  public saveHabitTracker(): void {
    this.saveMonthlyTask.selectedTheme = this.selectedTheme;
    if (this.taskProgress.length > 0) {
      this.taskProgress = this.taskProgress.filter(tp => tp.habitName !== '')
      if (this.taskProgress.length === 0) {
        this.dataSource = new MatTableDataSource(this.taskProgress);
        this.toastr.warning('Add a habit to save');
        return;
      }
    } else {
      this.toastr.warning('Add a habit to save');
      return;
    }
    console.log(this.taskProgress, this.saveMonthlyTask);
    this.WS.post('api/monthly/task/save', {
      taskInfo: this.saveMonthlyTask,
      progress: this.taskProgress
    }).subscribe((res: IResponse) => {
      if (res.status === 1) {
        this.toastr.success(res.description);
      } else if (res.status === 2) {
        this.toastr.info(res.description);
      } else {
        this.toastr.error(res.description);
      }
    });
  }

  public getSelectedRow(event: Event, i: number): any {
    console.log((event.target as HTMLInputElement).value, i)
    this.taskProgress[i].habitName = (event.target as HTMLInputElement).value;
    console.log(this.taskProgress)
    this.dataSource = new MatTableDataSource(this.taskProgress);
    // this.taskProgress.map((task, i) => {
    //   task.habitName = row.target.value,
    // })
  }

  public getSelectedCheckBox(event: Event, column: any, i: number): any {
    console.log((event.target as HTMLInputElement), column, i)
    this.taskProgress[i].progress.column = (event.target as HTMLInputElement).value;
    console.log(this.taskProgress)
    this.dataSource = new MatTableDataSource(this.taskProgress);
    // this.taskProgress.map((task, i) => {
    //   task.habitName = row.target.value,
    // })
  }

  public themeToggle(): void {
    console.log(this.saveMonthlyTask.selectedTheme);

  }

  public changeMonthGrid(): void {
    // let month = this.currentMonth.split('-')[1]
    this.displayedColumns = ['name'];
    const day = this.daysInMonth(this.currentMonth);
    this.createMonthColumn(day);
    // this.createDemoData();
  }

  public getMonthTaskData(): void {
    this.WS.post('api/monthly/task/get', {}).subscribe((res: IResponse) => {
      if (res.status === 1) {
        this.toastr.success(res.description);
      } else if (res.status === 2) {
        this.toastr.info(res.description);
      } else {
        this.toastr.error(res.description);
      }
    });
  }
}
