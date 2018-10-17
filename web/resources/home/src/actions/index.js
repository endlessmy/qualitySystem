import homeActions from './home';
import todoActions from './todo';
import mycreatedActions from './mycreated';
import workOrderActions from './workOrder';

export default {
    ...homeActions,
    ...todoActions,
    ...mycreatedActions,
    ...workOrderActions
};
