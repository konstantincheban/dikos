import FormBuilder, { ControlProps, FormBuilderRef } from '@base/FormBuilder';
import { createRef, useState } from 'react';
import './BudgetView.scss';
import { BudgetingFormData } from './BudgetView.types';
import * as Yup from 'yup';
import Button from '@base/Button';
import { useUserRepository } from 'src/helpers/repositories/useUserRepo';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';

const BudgetingShape = {
  amount: Yup.number()
    .min(0, 'Monthly budget should be greater than or equal to zero')
    .required('Required'),
  plannedCosts: Yup.number()
    .min(0, 'Monthly budget should be greater than or equal to zero')
    .required('Required'),
};

const BudgetFormSchema = Yup.object().shape(BudgetingShape);

const budgetingControls: ControlProps[] = [
  {
    controlType: 'input',
    type: 'number',
    name: 'amount',
    label: 'Your monthly budget',
    required: true,
  },
  {
    controlType: 'input',
    type: 'number',
    name: 'plannedCosts',
    label: 'Amount of planned expenses',
    required: true,
  },
];

function BudgetView() {
  const formRef = createRef<FormBuilderRef>();
  const { userState$, authState$ } = useStore();
  const { budgetData } = useObservableState(userState$);
  const { budgetID } = useObservableState(authState$);
  const { editBudget } = useUserRepository();
  const [enabledSubmit, setEnabledSubmit] = useState(false);

  const handleSubmitForm = () => {
    formRef.current?.submitForm();
  };

  const onSubmitForm = (values: BudgetingFormData) => {
    editBudget(values, budgetID);
  };

  const validateForm = (isValid: boolean) => {
    setEnabledSubmit(isValid);
  };

  return (
    <div className="BudgetViewContainer">
      <div className="ViewTitle">Budgeting</div>
      <div className="BudgetingContainer">
        <div className="BudgetingForm">
          <FormBuilder<BudgetingFormData>
            ref={formRef}
            containerClassName="TransactionForm"
            initialData={budgetData}
            validationSchema={BudgetFormSchema}
            controls={budgetingControls}
            onSubmit={onSubmitForm}
            onBlurValidate={(isValid) => validateForm(isValid)}
          />
          <Button
            className="SubmitBudgetForm"
            onClick={handleSubmitForm}
            disabled={!enabledSubmit}
          >
            <span>Update budget</span>
          </Button>
        </div>
        <div className="BudgetingInfo">
          <span>{budgetData.perDay} UAH - daily budget</span>
        </div>
      </div>
    </div>
  );
}

export default BudgetView;
