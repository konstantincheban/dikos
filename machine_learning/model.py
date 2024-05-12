""" Handle forecasting functionality """
import re
import json
import datetime
import logging

import pandas as pd
import numpy as np
import xgboost as xgb

from scipy import stats
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error, r2_score
from sklearn.model_selection import train_test_split


logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def extract_number(s):
    """
    Extract number from the string
    """
    match = re.search(r'\d+', s)
    return int(match.group()) if match else None

def add_lags(df):
    """
    Add lags to the dataset
    """
    df['lag1_amount'] = df['amount'].shift(11)
    df['lag2_amount'] = df['amount'].shift(19)
    df['lag3_amount'] = df['amount'].shift(29)

    df['lag1_min_trx'] = df['min_trx'].shift(11)
    df['lag2_min_trx'] = df['min_trx'].shift(19)
    df['lag3_min_trx'] = df['min_trx'].shift(29)

    df['lag1_max_trx'] = df['max_trx'].shift(11)
    df['lag2_max_trx'] = df['max_trx'].shift(19)
    df['lag3_max_trx'] = df['max_trx'].shift(29)

    df['lag1_med_trx'] = df['med_trx'].shift(11)
    df['lag2_med_trx'] = df['med_trx'].shift(19)
    df['lag3_med_trx'] = df['med_trx'].shift(29)

    df['lag1_mean_trx'] = df['mean_trx'].shift(11)
    df['lag2_mean_trx'] = df['mean_trx'].shift(19)
    df['lag3_mean_trx'] = df['mean_trx'].shift(29)

    df['lag1_num_trx'] = df['num_trx'].shift(11)
    df['lag2_num_trx'] = df['num_trx'].shift(19)
    df['lag3_num_trx'] = df['num_trx'].shift(29)

    return df

def create_features(df):
    """
    Create time series features based on time series index.
    """
    df = df.copy()
    # time features
    df['dayofweek'] = df.index.dayofweek
    df['quarter'] = df.index.quarter
    df['month'] = df.index.month
    df['year'] = df.index.year
    df['dayofyear'] = df.index.dayofyear
    df['dayofmonth'] = df.index.day
    df['weekofyear'] = df.index.isocalendar().week

    df = add_lags(df)
    return df

def make_xgboost_reg(X_train, y_train, X_test, y_test, forecast_type):
    """
    Make XGBoost regressor
    """
    best_income_params = {
        "booster": 'gbtree',
        "objective": 'reg:squarederror',
        "colsample_bytree": 0.6,
        "learning_rate": 0.9,
        "max_depth": 9,
        "n_estimators": 398,
        "subsample": 0.7
    }

    if forecast_type == 'income':
        reg = xgb.XGBRegressor(**best_income_params)
    else:
        reg = xgb.XGBRegressor()
    reg.fit(X_train, y_train,
            eval_set=[(X_train, y_train), (X_test, y_test)],
            verbose=100)
    return reg

def make_prediction(reg, X_test):
    """
    Predict values
    """
    return reg.predict(X_test)

def print_stats(y_test, pred):
    """
    Log metrics which represents efficiency of the model predictions
    """
    logging.info(f'RMSE: {round(np.sqrt(mean_squared_error(y_true=y_test, y_pred=pred)), 3)}')
    logging.info(f'MAE: {round(mean_absolute_error(y_true=y_test, y_pred=pred), 3)}')
    logging.info(f'MAPE: {round(mean_absolute_percentage_error(y_true=y_test, y_pred=pred), 3)}')
    logging.info(f'r2: {round(r2_score(y_true=y_test, y_pred=pred), 3)}')

def base_line_comparison(y_train, y_test, model_predictions):
    """
    Compare predicted values with base line values (mean number)
    """
    # Define and fit the baseline model (predicting the mean)
    baseline_prediction = np.mean(y_train)
    baseline_predictions = np.full(len(y_test), baseline_prediction)

    # Calculate RMSE for both models
    baseline_rmse = np.sqrt(mean_squared_error(y_test, baseline_predictions))
    xgb_rmse = np.sqrt(mean_squared_error(y_test, model_predictions))

    logging.info(f"Baseline RMSE: {baseline_rmse}")
    logging.info(f"XGBoost RMSE: {xgb_rmse}")

def create_future_pred(reg, main_df, period, features):
    """
    Forecast future values
    """
    # Create future dataframe
    start_date = main_df.index[-1]
    horizon_date = start_date + datetime.timedelta(days=30 * extract_number(period))
    future = pd.date_range(start_date.strftime('%Y-%m-%d'), horizon_date.strftime('%Y-%m-%d'), freq='1d')
    future = future.tz_localize('UTC').tz_convert('Europe/Athens')
    future_df = pd.DataFrame(index=future)
    future_df['isFuture'] = True
    main_df['isFuture'] = False
    df_and_future = pd.concat([main_df, future_df])
    df_and_future.index = pd.to_datetime(df_and_future.index)
    df_and_future = create_features(df_and_future)
    future_DF = df_and_future.query('isFuture').copy()
    future_DF['pred'] = reg.predict(future_DF[features])
    return future_DF

def sum_aggregator(series):
    return series.sum()

def min_aggregator(series):
    if len(series) > 0:
        return min(series)
    return 0

def max_aggregator(series):
    if len(series) > 0:
        return max(series)
    return 0

def mean_aggregator(series):
    return series.mean()

def median_aggregator(series):
    return series.median()

def num_aggregator(series):
    return len(series)

def resample_and_create_features(df, resample_key):
    """
    Resample entries in the df and add some new features
    """
    amount_df = df['amount'].resample(resample_key).apply(sum_aggregator)
    features_df = df['amount'].resample(resample_key).apply(
        {
            'min_trx': min_aggregator,
            'max_trx': max_aggregator,
            'med_trx': median_aggregator,
            'mean_trx': mean_aggregator,
            'num_trx': num_aggregator
        }
    )
    res_df = df.copy().resample(resample_key).sum()
    res_df['amount'] = amount_df
    res_df['min_trx'] = features_df['min_trx']
    res_df['max_trx'] = features_df['max_trx']
    res_df['med_trx'] = features_df['med_trx']
    res_df['mean_trx'] = features_df['mean_trx']
    res_df['num_trx'] = features_df['num_trx']
    return res_df

def replace_zeros(df):
    """
    Resample all zero values in the df with pre-zero values
    """
    pseudo_zero = 1e-6
    return df.replace(0, pseudo_zero)

def forecast(data_path: str):
    """
    Main method to forecast future values
    """
    try:
        logging.info(f'Start loading JSON {data_path}')
        # Reading JSON data
        with open(data_path, 'r') as file:
            data = json.load(file)
        period = data['period']
        forecast_type = data['forecast_type']

        df = pd.DataFrame(data['data'])

        # Convert 'datetime' column to datetime
        df['dateTime'] = pd.to_datetime(df['dateTime'], errors='coerce')

        df.dateTime = df.dateTime.dt.tz_convert('Europe/Athens')
        df.set_index('dateTime', inplace=True)
        df = df.sort_index()

        if forecast_type == 'income':
            resample_features = [
                'dayofyear',
                'lag3_num_trx',
                'lag1_min_trx',
                'med_trx',
                'mean_trx',
                'num_trx',
                'dayofweek',
                'year',
                'lag3_amount',
                'lag1_med_trx',
                'lag2_min_trx',
                'lag3_mean_trx',
                'lag1_num_trx',
                'quarter',
                'lag1_amount',
                'lag2_amount',
                'lag3_min_trx',
                'lag1_max_trx',
                'lag2_max_trx',
                'lag3_max_trx',
                'lag2_med_trx',
                'lag3_med_trx',
                'lag1_mean_trx',
                'lag2_mean_trx',
                'lag2_num_trx'
            ]
            # resample_features = [
            #     'weekofyear',
            #     'dayofweek',
            #     'quarter',
            #     'dayofyear',
            #     'dayofmonth',
            #     'lag1_amount',
            #     'lag2_amount',
            #     'lag2_min_trx',
            #     'lag3_min_trx',
            #     'lag2_max_trx',
            #     'lag1_med_trx',
            #     'lag3_med_trx',
            #     'lag1_mean_trx',
            #     'lag2_mean_trx',
            #     'month',
            #     'lag3_amount',
            #     'lag1_min_trx',
            #     'lag1_max_trx',
            #     'lag3_max_trx',
            #     'lag2_med_trx',
            #     'lag3_mean_trx',
            #     'lag1_num_trx',
            #     'lag2_num_trx',
            #     'lag3_num_trx',
            # ]
        else:
            resample_features = [
                'dayofweek',
                'lag3_amount',
                'lag1_med_trx',
                'lag2_min_trx',
                'lag1_num_trx',
                'lag3_num_trx',
                'dayofyear',
                'lag3_max_trx',
                'lag3_med_trx',
                'lag2_num_trx',
                'med_trx',
                'mean_trx',
                'num_trx',
            ]

        current_type = 'daily'

        main_df = df.copy()
        if 'daily' in current_type:
            main_df = resample_and_create_features(main_df, 'D')
        elif 'weekly' in current_type:
            main_df = resample_and_create_features(main_df, 'W')

        # keep outliers for the income data
        if forecast_type == 'expenses':
            # remove outliers dynamically
            z_scores = np.abs(stats.zscore(main_df['amount']))
            threshold = 0.7
            main_df = main_df[(z_scores <= threshold)]

        main_df = create_features(main_df)
        main_df = replace_zeros(main_df)

        TARGET = 'amount'

        X = main_df[resample_features]
        y = main_df[TARGET]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

        reg = make_xgboost_reg(X_train, y_train, X_test, y_test, forecast_type)

        predictions = make_prediction(reg, X_test)
        print_stats(y_test, predictions)
        base_line_comparison(y_train, y_test, predictions)

        future_df = create_future_pred(reg, main_df, period, features=resample_features)
        df_reset = future_df.reset_index()
        df_reset = df_reset[['index', 'pred']]
        df_reset.columns = ['dateTime', 'amount']
        json_result = df_reset.to_json(orient='records', date_format='iso')
        # Writing JSON data
        re_dpath = data_path.replace('data', 'results')
        with open(re_dpath, 'w') as file:
            file.write(json_result)
    except Exception as _e:
        logging.error('An error occurred while forecasting...', exc_info=True)
