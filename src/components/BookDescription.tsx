
import React from 'react';

interface BookDescriptionProps {
  description: string;
  synopsis?: string;
}

const BookDescription = ({ description, synopsis }: BookDescriptionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
      {synopsis && (
        <>
          <h4 className="text-md font-semibold text-slate-800 mt-4 mb-2">Synopsis</h4>
          <p className="text-slate-600 leading-relaxed">{synopsis}</p>
        </>
      )}
    </div>
  );
};

export default BookDescription;
