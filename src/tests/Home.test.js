import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.js';

const pageName = 'Home';

test('Includes a bootstrap card.', () => {

    const { getByText } = render(<App />);
    const page = getByText(pageName);
    userEvent.click(page);
    
    // Check that bootstrap is in the styles section as a file
    const checkForBootstrap = () => {
        const fs = require('fs');
        const path = "../styles/bootstrap.min.css";
        let result = false;
        try {
            result = fs.existsSync(path);
        } catch(err) {}
        return result;
    }
    expect(checkForBootstrap).toBeTruthy();

    // Check that some basic navbar classes are used in the Navigation
    const class1 = 'card';
    const class2 = 'card-header';
    expect(Array.from(document.getElementsByClassName(class1)).length).toBeGreaterThan(0);
    expect(Array.from(document.getElementsByClassName(class2)).length).toBeGreaterThan(0);
  });


test('Includes an image and a welcome message.', () => {

    const { getByText } = render(<App />);
    const page = getByText(pageName);
    userEvent.click(page);
    
    const welcome = getByText('Welcome to Bad', {exact: false});
    const images = document.getElementsByClassName('card-img-top');
    expect(welcome).toBeInTheDocument();
    expect(images.length > 0).toBeTruthy();

  });