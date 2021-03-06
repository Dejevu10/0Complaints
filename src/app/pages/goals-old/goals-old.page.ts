import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {GoalService} from 'src/app/services/goal/goal.service';
import {Goal} from 'src/app/model/goal';
import {Location} from '@angular/common';
import {ActivityService} from 'src/app/services/activity/activity.service';
import {Activity} from 'src/app/model/activity';

// import { ConsoleReporter } from 'jasmine';

@Component({
    selector: 'app-goals-old',
    templateUrl: './goals-old.page.html',
    styleUrls: ['./goals-old.page.scss'],
})
export class GoalsOldPage implements OnInit {
    slideOpts = {
        initialSlide: 3
    };
    wonGoals: any;
    wonGoalsName: any;
    allInfo: any[] = [];
    goalsHistory: Array<Goal>;
    lastGoalM = 0;
    lastGoalV = 0;
    lastGoalW = 0;
    activitiesGoals: Array<Activity>;
    relative: number;
    wholeDuration: any[];
    relativeV: number;
    relativeW: number;

    oldGoals: any[] = [];

    constructor(private goalService: GoalService, private activityService: ActivityService, private location: Location) {
        const that = this;
        this.allInfo = that.allInfo;
        let latestGoalTimeM = 0;
        let latestGoalTimeV = 0;
        let latestGoalTimeW = 0;

        this.goalService.getGoals().subscribe(data => {
            this.goalsHistory = data;


            this.goalsHistory.forEach(function(goal) {

                goal.history.forEach(function(history) {
                    for (const hist in history) {
                        if (history.hasOwnProperty(hist)) {

                            const obj = {
                                name: goal.name,
                                val: history[hist],
                                time: hist
                            };
                            that.allInfo.push(obj);
                        }
                    }
                });
            });

            for (let weekNumber = 3; weekNumber >= 0; weekNumber--) {
                const lastSunday = new Date();
                lastSunday.setDate(lastSunday.getDate() - (7 * weekNumber) - lastSunday.getDay());


                latestGoalTimeW = 0;
                latestGoalTimeV = 0;
                latestGoalTimeM = 0;
                that.lastGoalM = 0;
                that.lastGoalV = 0;
                that.lastGoalW = 0;
                this.allInfo.forEach(function(changedGoal) {

                    if (changedGoal.time < lastSunday.getTime()) {
                        //  console.log(changedGoal.val);


                        if (changedGoal.time > latestGoalTimeM && changedGoal.name === 'weeklyModerate') {
                            latestGoalTimeM = changedGoal.time;
                            that.lastGoalM = changedGoal.val;

                        }

                        if (changedGoal.time > latestGoalTimeV && changedGoal.name === 'weeklyVigorous') {
                            latestGoalTimeV = changedGoal.time;
                            that.lastGoalV = changedGoal.val;
                        }


                        if (changedGoal.time > latestGoalTimeW && changedGoal.name === 'weeklyWeight') {
                            latestGoalTimeW = changedGoal.time;
                            that.lastGoalW = changedGoal.val;
                        }
                    }
                    if (that.lastGoalV === 0) {
                        that.lastGoalV = 600;
                    }
                    if (that.lastGoalW === 0) {
                        that.lastGoalW = 600;
                    }
                    if (that.lastGoalM === 0) {
                        that.lastGoalM = 600;
                    }
                });
                const oldGoalM: any = {
                    name: '',
                    intensiy: '',
                    weekNumber: 0,
                    weekGoal: 0,
                    duration: 0,
                    relative: 0
                };
                const oldGoalV: any = {
                    name: '',
                    intensiy: '',
                    weekNumber: 0,
                    weekGoal: 0,
                    duration: 0,
                    relative: 0
                };
                const oldGoalW: any = {
                    name: '',
                    intensiy: '',
                    weekNumber: 0,
                    weekGoal: 0,
                    duration: 0,
                    relative: 0
                };
                oldGoalM.name = 'weekly moderate ' + weekNumber;
                oldGoalM.weekNumber = weekNumber;
                oldGoalM.intensity = 'moderate';
                oldGoalM.weekGoal = that.lastGoalM;
                that.oldGoals.push(oldGoalM);

                oldGoalV.name = 'weekly vigorous ' + weekNumber;
                oldGoalV.weekNumber = weekNumber;
                oldGoalV.intensity = 'vigorous';
                oldGoalV.weekGoal = that.lastGoalV;
                that.oldGoals.push(oldGoalV);

                oldGoalW.name = 'weekly weight training ' + weekNumber;
                oldGoalW.weekNumber = weekNumber;
                oldGoalW.intensity = 'weightTraining';
                oldGoalW.weekGoal = that.lastGoalW;
                that.oldGoals.push(oldGoalW);

                console.log(that.oldGoals);
            }
            

        });
        this.activitiesFromLastWeek();

    }


    ngOnInit() {

    }

    activitiesFromLastWeek() {
        const that = this;
        // let today: Date = new Date();
        // let today2: Date = new Date();
        //  let day: number = today.getDay();
        //  let lastSunday2: Date = new Date(today.setDate(today.getDate() - day));
        // let lastSecSunday: Date = new Date(today2.setDate(today2.getDate() - day - 7));
        let lastWekkActivities = [];

        this.activityService.getAllUserActivities().subscribe(data => {
            console.log(data);

            // console.log(lastSecSunday);
            //     let wholeDuration = [];
            for (let weekNumber = 3; weekNumber >= 0; weekNumber--) {
                this.activitiesGoals = [];
                lastWekkActivities = [];
                const lastSunday = new Date();
                const lastSecSunday = new Date();
                lastSunday.setDate(lastSunday.getDate() - (7 * weekNumber) - lastSunday.getDay());
                lastSecSunday.setDate(lastSecSunday.getDate() - (7 * weekNumber) - lastSecSunday.getDay() - 7);


                lastWekkActivities.push(data.filter(function(activity) {
                    return activity.startTime.getTime() < lastSunday.getTime() && activity.startTime.getTime() > lastSecSunday.getTime();
                }));
                this.activitiesGoals = lastWekkActivities;

                const intensities = [
                    {id: 'vigorous', name: 'vigorous'},
                    {id: 'moderate', name: 'moderate'},
                    {id: 'weightTraining', name: 'weight training'}
                ];

                const weeklyActivityDurations = [];
                lastWekkActivities.forEach(function(weekly) {
                    const obj = {
                        vigorous: [],
                        moderate: [],
                        weightTraining: []
                    };
                    intensities.forEach(function(intensity) {
                        obj[intensity.id] = weekly
                            .filter((activity) => activity.intensity === intensity.name)
                            .reduce(((totalDuration, activity) => totalDuration + activity.getDuration()), 0);
                    });

                    weeklyActivityDurations.push(obj);
                });
                this.wholeDuration = weeklyActivityDurations;
                let moderate: any;
                let vigorous: any;
                let weight: any;
                moderate = this.wholeDuration.map((intensity) => intensity.moderate);
                vigorous = this.wholeDuration.map((intensity) => intensity.vigorous);
                weight = this.wholeDuration.map((intensity) => intensity.weightTraining);
                console.log(weight);

                this.oldGoals.forEach(function(goal) {
                    if (goal.intensity === 'moderate' && goal.weekNumber === weekNumber) {
                        goal.duration = moderate;
                        goal.relative = goal.duration / goal.weekGoal;
                    }
                    if (goal.intensity === 'vigorous' && goal.weekNumber === weekNumber) {
                        goal.duration = vigorous;
                        goal.relative = goal.duration / goal.weekGoal;
                    }
                    if (goal.intensity === 'weightTraining' && goal.weekNumber === weekNumber) {
                        goal.duration = weight;
                        goal.relative = goal.duration / goal.weekGoal;
                    }

                });
                console.log(this.oldGoals);

            }
        });
    }


    goBack() {
        this.location.back();
    }


}
