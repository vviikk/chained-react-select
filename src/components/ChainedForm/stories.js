import React from 'react';
// Import the storybook libraries
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// Import our component from this folder
import ChainedForm from './ChainedForm';

const fields = [
    {
        label: 'test',
        items: [{
            label: 'asd',
            value: 'asd',
        },
        {
            label: 'aasdasdsd',
            value: 'aasdsd',
        }]
    },
    {
        label: 'test2',
        items: [{
            label: 'bcd',
            value: 'bcd',
        },{
            label: 'bbbbcd',
            value: 'bbbbcd',
        }]
    },
    {
        label: 'test3',
        items: [{
            label: 'ccccsd',
            value: 'cccccsd',
				}],
				placeholder: 'Custom placeholder'
    }
];

// Here we describe the stories we want to see of the Button. The component is
// pretty simple so we will just make two, one with text and one with emojis
// Simple call storiesOf and then chain .add() as many times as you wish
//
// .add() takes a name and then a function that should return what you want
// rendered in the rendering area
storiesOf('ChainedForm')
	.add('with text', () => (
		<ChainedForm fields={fields} placeholder="placeholder" onSelect={action('selected')}/>
	));
