import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as echarts from 'echarts';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  router = inject(Router)

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.renderDoughnutChart();
  }

  renderDoughnutChart() {
    const chartDom = document.getElementById('doughnut-chart');
    const myChart = echarts.init(chartDom);

    // Doughnut chart option
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Overdue', 'Closed', 'Pending']  // Legends
      },
      itemStyle: {
        borderRadius: 2,
        borderColor: '#fff',
      },
      series: [
        {
          name: 'Categories',
          type: 'pie',
          radius: ['50%', '70%'],  // Doughnut chart: inner and outer radius
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
            { value: 335, name: 'Overdue' },
            { value: 234, name: 'Closed' },
            { value: 1548, name: 'Pending' }
          ],
          color: ['#FF0000', '#32cd32', '#FFDE00']
        }
      ]
    };

    myChart.setOption(option);  // Apply the chart option
  }

  adminPanel(isAdmin) {
    this.router.navigateByUrl('/reports', { state: isAdmin });
  }

}
