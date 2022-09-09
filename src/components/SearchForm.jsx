import React, { useState } from 'react';
import { Field, Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { mockFetchDataApiCall, required, validatePassengersCount } from '../utils/utils';

import SelectField from './SelectField';


const minData = new Date();
minData.setDate(minData.getDate() + 1);

const SearchForm = ({ onSubmit, initialValues }) => {
  const [errors, setErrors] = useState({});

  const fetchOptions = async (term, fieldName) => {
    try {
      setErrors({});
      const response = await mockFetchDataApiCall(term);

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((city) => ({
          value: city[0],
          label: city[0],
        }));
      }
    } catch (e) {
      setErrors({ [fieldName]: 'Something went wrong. Please try again in a few seconds.' })
    }

    return [];
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        // potentially other mutators could be merged here
        ...arrayMutators
      }}
      initialValues={initialValues}
      validate={() => {}}
      render={({ form, values, handleSubmit, pristine, submitting, hasValidationErrors, submitFailed }) => (
        <div className="search-form row mb-5">
          <form onSubmit={handleSubmit}>
            <div className="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-3">
              <div className="bg-white rounded shadow-sm p-4">
                <div>
                  {errors && errors.cityOfOrigin &&  (
                    <div className="small text-danger mb-2">{errors.cityOfOrigin }</div>
                  )}
                  <SelectField
                    name="cityOfOrigin"
                    label="City of origin"
                    fetchOptions={fetchOptions}
                    validate={required}
                    initialValue={initialValues?.cityOfOrigin}
                  />
                </div>

                <FieldArray
                  name="intermediateCities"
                  initialValue={initialValues?.intermediateCities}
                >
                  {({ fields }) => (
                    <div className="my-3">
                      {fields.map((city, index) => (
                        <div key={city} className="mt-4 row justify-content-center">
                          <div className="col mb-3">
                            <SelectField
                              name={`${city}`}
                              label="Intermediate city"
                              fetchOptions={fetchOptions}
                              initialValue={values.intermediateCities[index] }
                              validate={required}
                            />

                          </div>

                          <div className="col-auto d-flex">
                            <div className="d-flex  align-items-start">
                              <button
                                type="button"
                                className="btn btn-link text-secondary ml-auto mt-4 pt-2"
                                disabled={submitting}
                                onClick={() => fields.remove(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn btn-outline-secondary mt-2"
                        disabled={submitting}
                        onClick={() => fields.push('')}
                      >
                        Add intermediate city
                      </button>
                    </div>
                  )}
                </FieldArray>

                <div>
                  <SelectField
                    name="cityOfDestination"
                    label="City of destination"
                    fetchOptions={fetchOptions}
                    initialValue={initialValues?.cityOfDestination}
                    validate={required}
                  />
                </div>

                <div className="row">
                  <div className="col-12 col-lg-6">
                    <Field
                      name="date"
                      validate={required}
                    >
                      {({ input, meta }) => (
                        <div className="mt-3">
                          <div>
                            <label
                              className="form-label"
                            >
                              Date of the trip
                            </label>

                            <input
                              className="form-control"
                              type="date"
                              name="date"
                              min={minData.toISOString().substring(0, 10)}
                              {...input}
                            />
                          </div>

                          {meta.error && meta.touched && (
                            <span className="small text-danger d-inline-block mt-2">{meta.error}</span>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="col-12 col-lg-6">
                    <Field
                      name="passengersCount"
                      validate={validatePassengersCount}
                    >
                      {({ input, meta }) => (
                        <div className="mt-3">
                          <div>
                            <label
                              className="form-label"
                            >
                              Number of passengers
                            </label>

                            <input
                              className="form-control"
                              type="number"
                              name="passengersCount"
                              min={1}
                              step={1}
                              formNoValidate
                              {...input}
                            />
                          </div>

                          {meta.error && meta.touched && (
                            <span className="small text-danger d-inline-block mt-2">{meta.error}</span>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
              </div>

              <div className="d-flex mt-4">
                <button
                  type="button"
                  className="btn btn-secondary ms-auto me-3"
                  onClick={() => {
                    form.restart({ });
                  }}
                  disabled={submitting}
                >
                  Reset
                </button>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={submitting || (hasValidationErrors && submitFailed)}
                >
                  Calculate distances
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    />
  );
};

export default SearchForm;
