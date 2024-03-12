import React from 'react';

const MyButton = () => {
    return (
        <section className="flexlayoutSaction">
          <button 
            style={{
              background: 'blue', 
              color: 'white',
              width: '200px',
              height: '100px'
            }}>
            Primary Button
          </button>
          {/* <button onClick={() => setCount(count + 1)}>
            increase count: {count}
          </button> */}
        </section>
    );
};

export default MyButton;

