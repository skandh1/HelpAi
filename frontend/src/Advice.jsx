import React from 'react';

const Advice = ({ advice }) => {
  return (
    <div className="p-4">
      {advice.length > 0 && (
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          {advice[0].book}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advice.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {item.adviceType}
            </h3>
            <p className="text-gray-700 mt-2">{item.advice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advice;