/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

const ChainedForm = ({
	fields, placeholder, onSelect, Wrapper, shouldReset
}) => {
	const [formState, setFormState] = useState();

	const ControlledSelect = ({ field, resets }) => {
		const [value, setValue] = useState(field.value);
		const [items, setItems] = useState(field.items);

		return {
        Select: (<ReactSelect
				value={value}
				options={items}
				placeholder={field.placeholder || placeholder}
				onChange={(selected) => {
					setValue(selected);
					setFormState();
					if (value && selected.value !== value.value && shouldReset) {
						resets.forEach(fn => fn());
					}
				}}
			/>),
			value,
			setValue,
			setItems,
			field, // append original field object
		};
	};

	const decoratedFields = fields.reduceRight(
		(acc, field) => {
			const resets = acc.map(f => () => {
				f.setValue(null);
				f.setItems([]);
			});

			return acc.concat(
				ControlledSelect({
					field,
					resets,
				}),
			);
		},
		[],
	).reverse();

	useEffect(
		() => {
			const reply = decoratedFields.reduce(
				(prevState, currentField) => (
					{
						...prevState,
						[currentField.label]: currentField.value,
					}),
				{},
			);

			onSelect(reply);
		},
		[decoratedFields, formState, onSelect],
	);

	return (decoratedFields.map(({Select, field}) => (
		<Wrapper key={field.label}>
			<label>{field.label}</label>
			{Select}
		</Wrapper>
	)));
};

ChainedForm.propTypes = {
	fields: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			label: PropTypes.string,
			items: PropTypes.array,
			placeholder: PropTypes.string,
		}),
	),
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	Wrapper: PropTypes.node.isRequired,
	shouldReset: PropTypes.bool,
};

ChainedForm.defaultProps = {
	Wrapper: styled.div``,
	shouldReset: true,
};

export default ChainedForm;
