import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './About';
import '@testing-library/jest-dom';
import renderer from "react-test-renderer";

describe('About', () => {

    it('should render correctly', () => {
        const tree = renderer.create(<About/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders About component', () => {
        render(<About />);
        expect(screen.getByText('About Hackathon Junction')).toBeInTheDocument();
        expect(screen.getByText('Welcome to the hub of innovation and creativity where coders, designers, and innovators come together to solve challenging problems and build amazing projects in a collaborative environment.')).toBeInTheDocument();
        expect(screen.getByText('FAQs')).toBeInTheDocument();
        expect(screen.getByText('Currently, this is just a coding exercise.')).toBeInTheDocument();
    });
});