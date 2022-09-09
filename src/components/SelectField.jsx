import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form'
import AsyncSelect from 'react-select/async';

const SelectField = ({ name, label, fetchOptions, validate, initialValue }) => {
  const [isLoading, setIsLoading] = useState(null);
  const _value = initialValue
    ? {
      value: initialValue,
      label: initialValue,
    }
    : undefined;
  const [fieldValue, setFieldValue] = useState(_value);

  const loadOptions = async (term) => {
    if (!term) {
      return [];
    }

    setIsLoading(true);
    const results =  await fetchOptions(term, name);
    setIsLoading(false);
    return results;
  };

  return (
    <>
      {label && (
       <label
         htmlFor={name}
         className="form-label"
       >
         {label}
       </label>
      )}

      <Field
        name={name}
        id={name}
        validate={validate}
      >
        {({ input, meta ,  }) => (
          <>
            <AsyncSelect
              {...input}
              cacheOptions
              loadOptions={loadOptions}
              value={fieldValue}
              fieldValue={fieldValue}
              isClearable={true}
              defaultValue={fieldValue?.value}
              onChange={(v) => {
                setFieldValue(v);
                input.onChange(v.value);
              }}
              isLoading={isLoading}
              noOptionsMessage={(data) => {
                if (data.inputValue === '') {
                  return 'Start typing...';
                }
                return 'No result found';
              }}
            />
            {meta.error && meta.touched && (
              <span className="small text-danger d-inline-block mt-2">{meta.error}</span>
            )}
          </>
        )}
      </Field>
    </>
  )
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  fetchOptions: PropTypes.func.isRequired,
  validate: PropTypes.func,
};

SelectField.defaultProps = {
  label: null,
  validate: () => {},
};

export default SelectField;
