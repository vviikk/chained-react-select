import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Select from 'react-select';

const ChainedForm = ({
	fields, placeholder, onSelect, Wrapper,
}) => {
	const [formState, setFormState] = useState();

	const ControlledSelect = ({field, resets}) => {
			const [value, setValue] = useState(field.value);
			const [items, setItems] = useState(field.items);

			return {
				Select: (<Select
					value={value}
					options={items}
					placeholder={placeholder}
					onChange={(selected) => {
						setValue(selected);
						console.log(formState);
						// debugger;
						setFormState();
						if (value && selected.value !== value.value) {
							console.log(resets.length);
							resets.forEach(fn => fn(null));
						}
					}}
				/>),
				label: field.label,
				setValue,
				setItems,
				value,
		}
	}

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
				})
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

			console.log(reply, formState);
			onSelect(reply);
		},
		[decoratedFields, formState, onSelect],
	);

	return (decoratedFields.map(field => (
		<Wrapper key={field.label}>
			<label>{field.label}</label>
			{field.Select}
		</Wrapper>
	)));
};

ChainedForm.propTypes = {
	fields: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			label: PropTypes.string,
			items: PropTypes.array,
		}),
	),
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	Wrapper: PropTypes.node.isRequired,
};

ChainedForm.defaultProps = {
	Wrapper: styled.div``,
};

export default ChainedForm;
