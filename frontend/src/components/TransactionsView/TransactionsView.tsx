import Button from '@base/Button';
import Icon from '@base/Icon';
import {
  CalculateIcon,
  CaretRightIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
  ShoppingCategoryIcon,
} from '@base/Icon/IconSet';
import Loader from '@base/Loader';
import TagEditor, { ITagItem } from '@base/TagEditor';
import Tooltip from '@base/Tooltip';
import Undo from '@base/Undo';
import { useTransactionsRepository } from '@repos';
import {
  METRO_IMPORT_TYPE,
  MONO_IMPORT_TYPE,
  SUPPORTED_IMPORT_FILE_EXTS,
  TABLE_FILTER_KEY_VALUE_SEPARATOR,
  TABLE_FILTER_SEPARATOR,
  UNDO_DELAY,
  ITEMS_PER_PAGE
} from '@shared/constants';
import {
  EditTransactionRequest,
  IModalFormRef,
  ImportTransactions,
  ITransaction,
} from '@shared/interfaces';
import { buildQueryParamsString, classMap, formatDate } from '@shared/utils';
import { useStore } from '@store';
import { createBrowserHistory } from 'history';
import { useObservableState } from 'observable-hooks';
import { createRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useModalAPI } from 'src/helpers/modalAPI/modalAPI';
import ImportTransactionsForm from './ImportTransactionsForm/ImportTransactionsForm';
import { IImportTransactionsFormProps } from './ImportTransactionsForm/ImportTransactionsForm.types';
import TransactionForm from './TransactionForm/TransactionForm';
import { TransactionRawFormData } from './TransactionForm/TransactionForm.types';
import { columnsConfig, filterConfig } from './TransactionsViewConfig';
import { useLocation } from 'react-router-dom';
import { usePrevious } from '@hooks';
import './TransactionsView.scss';
import Checkbox from '@base/Checkbox';
import { Select, Option } from '@base/Select';

function TransactionsView() {
  const {
    getTransactions,
    editTransaction,
    deleteTransaction,
    deleteTransactions,
    importTransactions,
    setTransactionsCount,
    getTransactionsCount
  } = useTransactionsRepository();
  const { transactionsState$, accountsState$ } = useStore();
  const {
    loading,
    isUpToDate,
    proposedCategories,
    transactionsCount,
    error: transactionErrors,
  } = useObservableState(transactionsState$);
  const { accounts } = useObservableState(accountsState$);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [removingEntries, setRemovingEntries] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showActionManager, setShowActionManager] = useState(false);
  const [sumOfTransactions, setSumOfTransactions] = useState(0);

  const [filters, setFilters] = useState<ITagItem[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const previousFilterValue = usePrevious(filterValue);
  const previousSortValue = usePrevious(sortValue);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE[0]);
  const previousCurrentPage = usePrevious(currentPage);
  const previousPerPage = usePrevious(perPage);

  const history = createBrowserHistory({ window });
  const location = useLocation();

  const { modalRef } = useModalAPI();

  const transactionModalRef = createRef<IModalFormRef>();

  // set filters & sortValue by query params
  useEffect(() => {
    const filtersFromUrl = getFiltersFromUrl();
    const sortValueFromUrl = getSortValueFromUrl();
    setFilterValue(getFilterStringByFilters(filtersFromUrl));
    setSortValue(sortValueFromUrl);
    setFilters(filtersFromUrl);
  }, [location.search]);

  // update url by changing the sorting value
  useEffect(() => {
    setParamsToUrl(filters, sortValue);
  }, [sortValue]);

  // --------------------------
  // Transactions fetching Logic
  // --------------------------

  // get filtered transactions
  useEffect(() => {
    if (
      previousFilterValue !== filterValue ||
      previousSortValue !== sortValue ||
      previousPerPage !== perPage ||
      previousCurrentPage !== currentPage ||
      (!isUpToDate && !loading)
    ) {
      getTransactions(
        buildQueryParamsString({
          filter: filterValue
            ? `(${atob(filterValue.replace(/\(|\)/g, ''))})`
            : '',
          orderby: sortValue,
          skip: `${perPage * (currentPage - 1)}`,
          top: `${perPage}`,
        }),
      ).then((data) => {
        if (data) {
          setTransactions(data);
          if (filterValue) {
            setTransactionsCount(data.length);
          } else {
            getTransactionsCount();
          }
        }
      });
    }
  }, [filterValue, perPage, currentPage, sortValue, isUpToDate, loading]);

  // --------------------------
  // Filtering Logic
  // --------------------------

  const getSortValueFromUrl = () => {
    const filtersFromUrl = new URLSearchParams(location.search);
    return filtersFromUrl.get('orderby') ?? '';
  };

  const getFiltersFromUrl = (): ITagItem[] => {
    const filtersFromUrl = new URLSearchParams(location.search);
    return filtersFromUrl.get('filter')
      ? parseFilterParamsToTags(filtersFromUrl.get('filter') ?? '')
      : [];
  };

  const getParamByTag = (tag: ITagItem) => {
    return `${tag.key}${TABLE_FILTER_KEY_VALUE_SEPARATOR}${tag.value}`;
  };

  const parseFilterParamsToTags = (filter: string): ITagItem[] => {
    const filterString = atob(filter.replace(/\(|\)/g, ''));
    return filterString.split(TABLE_FILTER_SEPARATOR).map((filterItem) => {
      const [key, value] = filterItem.split(TABLE_FILTER_KEY_VALUE_SEPARATOR);
      return { key, value };
    });
  };

  const getFilterStringByFilters = (filters: ITagItem[]) => {
    return filters.length
      ? `(${btoa(
          filters
            .map((filter) => getParamByTag(filter))
            .join(TABLE_FILTER_SEPARATOR),
        )})`
      : '';
  };

  const setParamsToUrl = (filters: ITagItem[], sortValue: string) => {
    // filter example - ?filters=(name contains Test and category contains shopping)
    setFilterValue(getFilterStringByFilters(filters));
    history.replace({
      pathname: window.location.pathname,
      search: buildQueryParamsString({
        filter: filters.length ? getFilterStringByFilters(filters) : '',
        orderby: sortValue,
      }),
    });
  };

  const getImportTypeByFileName = (fileName: string) => {
    if (fileName.match(/xls/)) return METRO_IMPORT_TYPE;
    return MONO_IMPORT_TYPE
  }

  // --------------------------
  // Pagination logic
  // --------------------------

  const getLastPage = () => Math.ceil(transactionsCount / perPage);

  const handleFistPage = () => {
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleLastPage = () => {
    setCurrentPage(getLastPage());
  };

  const handleChangePerPage = (value: string) => {
    setPerPage(Number(value));
  }

  // -------------------------------
  // Transactions Edit/Delete/Import
  // -------------------------------

  const handleImportTransactions = (values: ImportTransactions) => {
    const formData = new FormData();
    formData.append('accountID', values.accountID);
    formData.append('aggregationType', values.aggregationType);
    formData.append('date', values.date);
    formData.append('file', values.file);

    importTransactions(formData, getImportTypeByFileName(values.file.name)).then(() => {
      if (!transactionErrors) modalRef.current?.close();
    })
  };

  const handleEditTransaction = (
    values: TransactionRawFormData<EditTransactionRequest>,
    transactionId: string,
  ) => {
    const { transactionType, ...data } = values;
    if (transactionType === 'expenses') data.amount = -data.amount;

    editTransaction(data, transactionId).then(() => {
      if (!transactionErrors) modalRef.current?.close();
    });
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id).then(() => {
      if (!transactionErrors) modalRef.current?.close();
    });
  };

  const handleValidateTransactionForm = (
    validState: boolean,
    actionID: string,
  ) => {
    modalRef.current?.updateActionsState([
      {
        id: actionID,
        disabled: !validState,
      },
    ]);
  };

  const handleOpenImportTransactionsModal = () => {
    const accountOptions: IImportTransactionsFormProps['availableAccounts'] =
      accounts.reduce((acc, account) => {
        if (account.type !== 'create') {
          acc?.push({
            value: account._id,
            label: account.name,
          });
        }
        return acc;
      }, [] as IImportTransactionsFormProps['availableAccounts']);
    modalRef.current?.open({
      options: {
        title: 'Import Transactions',
      },
      renderer: (
        <ImportTransactionsForm
          ref={transactionModalRef}
          availableAccounts={accountOptions}
          onSubmitForm={handleImportTransactions}
          validateForm={(validState: boolean) =>
            handleValidateTransactionForm(validState, 'importTransactions')
          }
        />
      ),
      actions: [
        {
          id: 'importTransactions',
          label: 'Save',
          disabled: true,
          handler: () => transactionModalRef?.current?.submitForm(),
        },
      ],
    });
  };

  const handleOpenEditTransactionModal = (transactionId: string) => {
    const transactionData = transactions.find(
      (item) => item._id === transactionId,
    ) as ITransaction;
    modalRef.current?.open({
      options: {
        title: 'Edit Transaction',
      },
      renderer: (
        <TransactionForm
          ref={transactionModalRef}
          type="edit"
          data={transactionData}
          proposedCategories={proposedCategories}
          onSubmitForm={(values) =>
            handleEditTransaction(
              values as TransactionRawFormData<EditTransactionRequest>,
              transactionId,
            )
          }
          validateForm={(validState) =>
            handleValidateTransactionForm(validState, 'editTransaction')
          }
        />
      ),
      actions: [
        {
          id: 'editTransaction',
          label: 'Save',
          disabled: true,
          handler: () => transactionModalRef?.current?.submitForm(),
        },
      ],
    });
  };

  const handleDeleteTransactionAction = (transactionId: string) => {
    let updatedEntries = [...removingEntries, transactionId];
    setRemovingEntries(updatedEntries);
    toast(
      <Undo
        onUndo={() => {
          updatedEntries = updatedEntries.filter(
            (item) => item !== transactionId,
          );
          setRemovingEntries(updatedEntries);
        }}
      />,
      {
        // hook will be called when the component unmount
        onClose: () => {
          if (updatedEntries.find((item) => item === transactionId))
            handleDeleteTransaction(transactionId);
        },
        hideProgressBar: false,
        autoClose: UNDO_DELAY,
        type: toast.TYPE.INFO,
      },
    );
  };

  const handleChangeFilterTags = (tags: ITagItem[]) => {
    setParamsToUrl(tags, sortValue);
    setFilters(tags);
  };

  const handleSortTableByColumn = (sortItemName: string) => {
    let updatedSortValue = '';
    const [sortProperty, criteria] = sortValue.split(' ');
    if (sortItemName === sortProperty) {
      if (criteria === 'asc') updatedSortValue = `${sortItemName} desc`;
      if (criteria === 'desc') updatedSortValue = ``;
    } else {
      updatedSortValue = `${sortItemName} asc`;
    }
    setSortValue(updatedSortValue);
  };

  const renderTransactionItem = (transaction: ITransaction, key: number) => {
    const {
      _id,
      name,
      description,
      paymaster,
      date,
      amount,
      currency,
      accountID,
      category
    } = transaction;
    const associatedAccountName = accounts.find(
      (account) => account._id === accountID,
    )?.name;
    return (
      <div
        key={`${name}_${amount}_${key}`}
        className={classMap(
          {
            removing: !!removingEntries.includes(_id),
            selected: !!selectedEntries.includes(_id),
          },
          'TransactionItem',
        )}
        onClick={() => handleToggleSelectEntry(_id)}
      >
        <div className="Block">
          <div
            title={category}
            className={classMap(
              { income: amount > 0, expenses: amount < 0 },
              'TransactionCategory Block',
            )}
          >
            <Icon size={25} icon={<ShoppingCategoryIcon />} />
          </div>
        </div>
        <div className="TransactionName Block">
          <span title={name}>{name}</span>
          <span title={description} className="description">
            {description}
          </span>
        </div>
        <div className="Block">
          <span>{`${amount} ${currency}`}</span>
        </div>
        <div className="Block">
          <span>{associatedAccountName}</span>
        </div>
        <div className="Block">{formatDate(date)}</div>
        <div className="Block">
          <span title={paymaster}>{paymaster}</span>
        </div>
        <div className="TransactionActions Block">
          <button onClick={(evt) => {
            evt.stopPropagation();
            handleOpenEditTransactionModal(_id);
          }}>
            <Icon size={13} icon={<EditIcon />} />
          </button>
          <button onClick={(evt) => {
            evt.stopPropagation();
            handleDeleteTransactionAction(_id);
          }}>
            <Icon size={17} icon={<CloseIcon />} />
          </button>
        </div>
      </div>
    );
  };

  const renderListPlaceholder = () => {
    return (
      <div className="EmptyListPlaceholderContainer">
        <span>No transaction was found</span>
      </div>
    );
  };

  const renderPagination = () => {
    const firstLabel = "<<";
    const prevLabel = "<";
    const nextLabel = ">";
    const lastLabel = ">>";
    const lastPage = getLastPage();
    return (
      <div className="PaginationContainer">
        <button
          className="action first-btn"
          disabled={currentPage === 1}
          onClick={handleFistPage}
        >{firstLabel}</button>
        <button
          className="action prev-btn"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >{prevLabel}</button>
        <span className="page-number">{currentPage} of {lastPage === 0 ? 1 : lastPage}</span>
        <button
          className="action next-btn"
          disabled={currentPage === lastPage}
          onClick={handleNextPage}
        >{nextLabel}</button>
        <button
          className="action last-btn"
          disabled={currentPage === lastPage}
          onClick={handleLastPage}
        >{lastLabel}</button>
      </div>
    )
  }

  const renderTransactionList = () => {
    const [sortProperty, criteria] = sortValue.split(' ');
    return (
      <div className="TransactionListContainer">
        <div className="TransactionListHeader">
          {columnsConfig.map((item) => (
            <div key={item.name} className="Block">
              <span title={item.label}>{item.label}</span>
              {item.sortable ? (
                <div
                  className={classMap(
                    {
                      [criteria as string]:
                        sortProperty === item.name && !!criteria,
                    },
                    'SortButtons',
                  )}
                  onClick={() => handleSortTableByColumn(item.name)}
                >
                  <div className="Sort-asc">
                    <Icon size={10} className="Up" icon={<CaretRightIcon />} />
                  </div>
                  <div className="Sort-desc">
                    <Icon
                      size={10}
                      className="Down"
                      icon={<CaretRightIcon />}
                    />
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
        <div className="TransactionsList">
          {transactions.length
            ? transactions.map(renderTransactionItem)
            : renderListPlaceholder()}
        </div>
        <div className="TransactionListFooter">
          <div className="PerPageContainer">
            <span>Per page: </span>
            <Select value={`${perPage}`} onChange={handleChangePerPage}>
              {ITEMS_PER_PAGE.map(option => <Option key={option} label={`${option}`} value={`${option}`}></Option>)}
            </Select>
          </div>
          <div className="PaginationContainer">
            {renderPagination()}
          </div>
        </div>
      </div>
    );
  };

  const renderFilterSection = () => {
    return (
      <div className="TransactionsViewFilterSection">
        <div className="AmountOfItems">{transactionsCount} Transactions</div>
        <div className="TagFilterSection">
          <TagEditor
            categories={filterConfig}
            tags={filters}
            singleTagMode={false}
            onChange={(tags) => handleChangeFilterTags(tags as ITagItem[])}
          ></TagEditor>
        </div>
      </div>
    );
  };

  const handleToggleSelectEntry = (entryId: string) => {
    const entryIndex = selectedEntries.indexOf(entryId);
    if (entryIndex === -1) {
      selectedEntries.push(entryId);
    } else {
      selectedEntries.splice(entryIndex, 1);
    }

    setSelectedEntries([...selectedEntries]);
    setShowActionManager(true);

    // reset sum of transactions on select item
    setSumOfTransactions(0);
  };

  const handleSelectAction = (checkState: boolean) => {
    let selectedList: string[] = [];
    if (checkState)
      selectedList = transactions.map((transaction) => transaction._id);

    setSelectedEntries(selectedList);
  };

  const handleDeleteEntriesAction = () => {
    deleteTransactions(selectedEntries);
    setSelectedEntries([]);
  };

  const handleCalculateEntriesAction = () => {
    const sum = transactions.reduce((acc, item) => {
      if (selectedEntries.includes(item._id)) acc += item.amount;
      return acc;
    }, 0);
    setSumOfTransactions(Math.floor(sum));

    toast.info(`Sum of selected transactions equals ${Math.floor(sum)} UAH`);
  };

  const renderActionManager = () => {
    return showActionManager ? (
      <div className="TransactionsViewActionManager">
        <div className="CloseActionManager">
          <Button
            size="small"
            icon={<CloseIcon />}
            onClick={() => setShowActionManager(false)}
          />
        </div>
        <div className="SelectAction">
          <Tooltip
            content={
              selectedEntries.length
                ? 'Click to unselect all entries in the list'
                : 'Click to select all entries in the list'
            }
          >
            <Checkbox
              checked={false}
              onChange={(value) => handleSelectAction(value)}
            />
          </Tooltip>
          <div className="SelectActionDesc">
            <b>{selectedEntries.length}</b>
            Selected Entries
          </div>
        </div>
        <div className="CalculationAction">
          <Tooltip
            content={
              sumOfTransactions
                ? `Sum of selected transactions equals ${sumOfTransactions} UAH`
                : `Click to calculate sum of transactions`
            }
          >
            <Button
              size="small"
              disabled={!selectedEntries.length}
              icon={<CalculateIcon />}
              onClick={handleCalculateEntriesAction}
            />
          </Tooltip>
        </div>
        <div className="DeleteAction">
          <Button
            size="small"
            disruptive
            disabled={!selectedEntries.length}
            icon={<DeleteIcon />}
            onClick={handleDeleteEntriesAction}
          />
        </div>
      </div>
    ) : (
      ''
    );
  };

  return (
    <div className="TransactionsViewContainer">
      {loading && <Loader />}
      <div className="TransactionsViewTopSection">
        <div className="ViewTitle">Transactions</div>
        <div className="TransactionViewImportBlock">
          <div className="TransactionViewImportInfo">
            <span>ImportTransactions</span>
            <Tooltip content={`Click to import transactions from ${SUPPORTED_IMPORT_FILE_EXTS.map(ext => `fileName.${ext}`).join(', ')}. Currently, we only have support for exported Metro receipts`}>
              <Icon size={17} className="InfoIconCommon" icon={<InfoIcon />} />
            </Tooltip>
          </div>
          <Button onClick={handleOpenImportTransactionsModal}>
            <span>Import Transactions</span>
          </Button>
        </div>
      </div>
      {renderFilterSection()}
      {renderTransactionList()}
      {renderActionManager()}
    </div>
  );
}

export default TransactionsView;
