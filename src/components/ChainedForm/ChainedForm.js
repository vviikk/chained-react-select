import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Select from 'react-select';

const ChainedForm = ({ fields, placeholder, onSelect, Wrapper }) => {
    const [formState, setFormState] = useState();

    const decoratedFields = fields.reduceRight(
        (acc, field) => {
						const [value, setValue] = useState();
						const [items, setItems] = useState(field.items);
            const resets = acc.map(f => () => {
							f.setValue(null);
							// f.setItems([]);
						});
            return acc.concat({
                ...field,
                value,
								setValue,
								items,
								setItems,
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
            <Wrapper>
                <label>{field.label}</label>
                <Select
                    placeholder={placeholder}
                    options={field.items}
                    value={field.value}
                    onChange={(selected) => {
											  field.setValue(selected);
											  if(selected.value !== field.value.value) {
													field.resets.forEach(fn => fn());
													setFormState(
															decoratedFields,
													);
												}
                    }}
                />
            </Wrapper>
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
		Wrapper: PropTypes.node.isRequired,
}

ChainedForm.defaultProps = {
	Wrapper: styled.div``,
}

export default ChainedForm;
