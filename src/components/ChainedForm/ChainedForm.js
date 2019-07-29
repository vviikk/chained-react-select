import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Select from 'react-select';

// const reducer = () => {}

const ChainedForm = ({ fields, placeholder, onSelect }) => {
    const [formState, setFormState] = useState();
    
    const decoratedFields = fields.reduceRight(
        (acc, field) => {
            const [value, setValue] = useState();
            const resets = acc.map(f => f.setValue);
            return acc.concat({
                ...field,
                value,
                setValue,
                resets,
            });
        },
        [],
        ).reverse();
        
    useEffect(() => {
        const reply = decoratedFields.reduce(
            (prevState, currentField) => (
                {
                    ...prevState,
                    [currentField.label]: currentField.value
                }),
                {},
            )
            console.log(reply);
            onSelect(reply);
        },
        [formState]
    );
    return (decoratedFields.map(field => {
        return (
            <div>
                <label>{field.label}</label>
                <Select
                    placeholder={placeholder}
                    options={field.items}
                    value={field.value}
                    onChange={(selected) => {
                        // console.log(field, selected);
                        field.resets.forEach(fn => fn(null));
                        field.setValue(selected);
                        setFormState(
                            decoratedFields,
                        );
                    }}
                />
            </div>
        );
    }));
}

ChainedForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            label: PropTypes.string,
            items: PropTypes.array,
        }
        )),
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
}

export default ChainedForm;