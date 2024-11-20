import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { CommonService } from '../services/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'cc-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {
  navController = inject(NavController);
  router = inject(Router);
  common = inject(CommonService);
  adminData: any;

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.renderDoughnutChart();
  }

  renderDoughnutChart() {
    this.adminData = JSON.parse(localStorage.getItem("repCt"));
    const chartDom = document.getElementById('doughnut-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Overdue', 'Closed', 'Pending']
      },
      itemStyle: {
        borderRadius: 2,
        borderColor: '#fff',
      },
      series: [
        {
          name: 'Categories',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          data: [
            { value: this.adminData?.overdue, name: 'Overdue' },
            { value: this.adminData?.closed, name: 'Closed' },
            { value: this.adminData?.pending, name: 'Pending' }
          ],
          color: ['#FF0000', '#32cd32', '#FFDE00']
        }
      ]
    };

    myChart.setOption(option);
  }

  adminPanel(isAdmin) {
    this.navController.navigateForward('/reports', {
      state: { isAdmin: true },
    });
  }

  navigateToMap() {

  }

  navigateToUserList() {
    this.router.navigateByUrl('/all-users', { state: { isAdmin: true } })
  }

}
