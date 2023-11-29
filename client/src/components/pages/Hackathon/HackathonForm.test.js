import {render, screen} from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import HackathonForm from "./HackathonForm";

describe('HackathonForm', () => {
    it('should render correctly', () => {
        const tree = renderer.create(<HackathonForm/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render with correct values of the hackathon and submit button label', () => {
        const hackathon = {
            eventName: 'Test Hackathon',
            description: 'This is a test',
            startDate: '2023-11-20T06:00:00.000Z',
            endDate: '2023-11-22T06:00:00.000Z'
        }
        const {container} = render(<HackathonForm onSubmit={jest.fn()} submitButtonLabel="Update" hackathon={hackathon}/>);
        expect(screen.getByText('Update')).toBeInTheDocument();
        const eventNameElement = container.querySelector('input', {value: 'Test Hackathon'});
        expect(eventNameElement).toBeInTheDocument();
        const descriptionElement = container.querySelector('textarea', {value: 'This is a test'});
        expect(descriptionElement).toBeInTheDocument();
        const startDateElement = screen.getByTestId('startDate');
        expect(startDateElement).toBeInTheDocument();
        expect(startDateElement).toHaveValue('11/20/2023');
        const endDateElement = screen.getByTestId('endDate');
        expect (endDateElement).toBeInTheDocument();
        expect(endDateElement).toHaveValue('11/22/2023');
    });

});