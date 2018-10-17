import api from 'common/utils/api';
import { PROJECT_MODULE_ROUTER } from 'common/constants/const';
import { GA_HOME as GaHome } from 'common/utils/ga';

export default {
    methods: {
        appUrl(app, projectList, callback) {
            GaHome.commonUseApp(this, app.remark, app.service_id);
            api.updateAppClickDate({
                service_id: app.service_id
            });
            let url = '';
            let urlLen = app.url.length;
            if (app.url.substr(urlLen - 1) === '=') {
                // 证明就要传入token
                url = `${app.url}${this.userToken}`;
            } else if (app.url.substr(urlLen - 1) === '!') {
                // 当以!结尾的时候证明是进项目里面的模块(功能需求、迭代版本、任务看板)
                if (projectList.length === 0) {
                    this.noProjectModalVisible = true;
                    this.app = app;
                    return '#';
                }
                let firstProjectId = projectList[0].pid;
                let firstProjectName = projectList[0].name;
                url = `${PROJECT_MODULE_ROUTER}/${firstProjectId}/${firstProjectName}`;
                if (app.remark === '功能需求') {
                    url += '/function/list';
                } else if (app.remark === '版本管理') {
                    url += '/versionList';
                } else if (app.remark === '任务看板') {
                    url += '/taskList/list';
                } else if (app.remark === 'DevOps') {
                    url += '/devOpsExecutiveLoggingList';
                }
            } else {
                // 当以#结尾就直接用url
                url = app.url;
            }
            window.open(url);

            callback && callback();
        }
    }
};
