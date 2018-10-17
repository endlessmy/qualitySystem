### 交互

一. **应用分类图标配置原则**

    1. remark字段 是配置应用显示的名称

    2. group_id字段

      1代表的是业务类  2代表的是研发类  3:代表的是其他

    2. icon字段  根据UI设计的icon的class来命名的

    4. url
        1:当不需要token的时候  url为/spms/static/requirement/index.html#/
        2:当需要token的时候  url必须以等号结尾例如: http://211.139.191.157:58080/bpmx/servlet/SendServiceOrderByToken?token=
        3:当url以#结尾的时候 就直接使用url但是要把#去掉
        4:当url以!结尾的时候 证明是项目里的模块

    5. background背景颜色字段
       crisis-bc // 危机类
       apply-tools-bc  //  应用工具
       task-bc // 任务类
       require-bc // 需求类
