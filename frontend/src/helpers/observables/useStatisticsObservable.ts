import { createSubject, useObservableBaseActions } from './utils';

const initialState = {};

const statisticsSubject$ = createSubject(initialState);

export const useStatisticsObservable = () => {
  const actions = useObservableBaseActions(statisticsSubject$);

  return {
    ...actions,
  };
};
