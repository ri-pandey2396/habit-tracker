import { DatePipe, formatCurrency } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  public addNewRow: FormGroup = new FormGroup({ progress: new FormGroup({}) });
  // public addNewRow: FormGroup = new FormGroup({ habitName: new FormControl(''), progress: new FormGroup({}) });
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
    private fb: FormBuilder, private toastr: ToastrService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    const mon = new Date().getMonth();
    this.currentDay = new Date().getDate();
    this.formSave = new FormGroup({
      data: new FormArray([])
    })

    // console.log(this.formSave, this.formSave.value);

    // console.log(this.currentDay)
    this.currentMonth = this.datepipe.transform(new Date(), 'yyyy-MM');

    const days = this.daysInMonth(this.currentMonth)
    // this.currentMonth = this.month[mon];
    this.selectedTheme = this.seasons[0];
    this.createMonthColumn(days);
    // this.createDemoData();
    this.getMonthTaskData();
    // this.createNewRow();
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

  public createNewRow(): void {
    const count = this.habits.length;
    const group: FormGroup = new FormGroup({ _id: new FormControl(''), progress: new FormGroup({}) });
    for (let j = 0; j < this.displayedColumns.length; j++) {
      if (this.checkTypeOfInput(this.displayedColumns[j])) {
        group.setControl(`habitName${count}`, new FormControl(''));
      } else {
        (group.controls['progress'] as FormGroup)
          .setControl(
            this.displayedColumns[j],
            new FormGroup({
              isSelected: new FormControl({ value: false, disabled: this.currentDay === parseInt(this.displayedColumns[j]) ? false : true })
            }))
      }
    }
    this.habits.push(group)
    // this.formSave.setValue({ data: this.addNewRow });
  }

  get habits(): any {
    return <FormArray>this.formSave.get('data');
  }
  public addRow(): void {
    this.createNewRow()
    // console.log((this.formSave.get('data') as FormArray).controls)
    this.dataSource = new MatTableDataSource((this.formSave.get('data') as FormArray).controls);
    this.changeDetectorRef.detectChanges();
  }

  public getProgress(element: any, column: any): FormControl {
    return element.get('progress').controls[column].get('isSelected')
  }

  public checkTypeOfInput(colValue: string): boolean {
    return isNaN(parseInt(colValue));
  }

  public disableCheckbox(val: string): boolean {
    // console.log(val)
    return this.currentDay !== parseInt(val)
  }

  public saveHabitTracker(): void {
    this.saveMonthlyTask.selectedTheme = this.selectedTheme;
    this.saveMonthlyTask.monthYear = this.currentMonth;
    if (this.habits.length > 0) {
      this.removeEmptyControls();
      if (this.habits.length === 0) {
        this.dataSource = new MatTableDataSource((this.formSave.get('data') as FormArray).controls);
        this.toastr.warning('Add a habit to save');
        return;
      }
    } else {
      this.toastr.warning('Add a habit to save');
      return;
    }
    this.WS.post('api/monthly/task/save', {
      taskInfo: this.saveMonthlyTask,
      progress: this.formSave.get('data')?.getRawValue()
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

  public removeEmptyControls(): void {
    let formArray = this.formSave.get('data') as FormArray;
    for (let i = formArray.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.value[`habitName${i}`] === '') {
        formArray.removeAt(i);
      }
    }
  }

  public getSelectedRow(event: any, i: number): any {
    // console.log((event.target as HTMLInputElement).value, i)
    // this.taskProgress[i].habitName = (event.target as HTMLInputElement).value;
    console.log(event)
    // this.dataSource = new MatTableDataSource(this.taskProgress);
    // this.taskProgress.map((task, i) => {
    //   task.habitName = row.target.value,
    // })
  }

  public getSelectedCheckBox(event: Event, column: any, i: number): any {
    // console.log((event.target as HTMLInputElement), column, i)
    this.taskProgress[i].progress.column = (event.target as HTMLInputElement).value;
    // console.log(this.taskProgress)
    this.dataSource = new MatTableDataSource(this.taskProgress);
    // this.taskProgress.map((task, i) => {
    //   task.habitName = row.target.value,
    // })
  }

  public themeToggle(): void {
    console.log(this.saveMonthlyTask.selectedTheme);

  }

  public changeMonthGrid(): void {
    this.displayedColumns = ['name'];
    const day = this.daysInMonth(this.currentMonth);
    this.createMonthColumn(day);
  }

  public mapTaskData(): void {
    const group: FormGroup = new FormGroup({ _id: new FormControl(''), progress: new FormGroup({}) });
    for (let j = 0; j < this.taskProgress.length; j++) {
      group.setControl('_id', new FormControl(this.taskProgress[j]._id));
      group.setControl(`habitName${j}`, new FormControl(this.taskProgress[j].habitName));
      if (this.taskProgress[j].hasOwnProperty('progress')) {
        const progressDays = Object.keys(this.taskProgress[j].progress)
        for (let i = 0; i < progressDays.length; i++) {
          (group.controls['progress'] as FormGroup)
            .setControl(
              progressDays[i],
              new FormGroup({
                isSelected: new FormControl({ value: false, disabled: this.currentDay === parseInt(progressDays[i]) ? false : true })
              }))
        }
        this.habits.push(group)

      }
      this.dataSource = new MatTableDataSource((this.formSave.get('data') as FormArray).controls);
      this.changeDetectorRef.detectChanges();
    }
  }

  public getMonthTaskData(): void {
    this.WS.post('api/monthly/task/get', { monthYear: this.currentMonth }).subscribe((res: IResponse) => {
      if (res.status === 1) {
        this.saveMonthlyTask = {
          _id: res.result.habits._id,
          goals: res.result.habits.goals,
          notes: res.result.habits.notes,
          selectedTheme: res.result.habits.selectedTheme
        };
        this.selectedTheme = this.saveMonthlyTask.selectedTheme as string;
        this.taskProgress = res.result.progress as ITaskProgress[];
        this.mapTaskData();
        this.toastr.success(res.description);
      } else if (res.status === 2) {
        this.toastr.info(res.description);
      } else {
        this.toastr.error(res.description);
      }
    });
  }
}
