import React, { useState } from 'react';

const traits = [
  '外向性',
  'ストレス',
  '新規性',
  '協調性',
  '計画性'
];

function PersonalityTraitsChecklist({ onTraitsChange }) {
  const [selectedTraits, setSelectedTraits] = useState([]);

  const handleTraitChange = (trait) => {
    setSelectedTraits(prevSelectedTraits => {
      if (prevSelectedTraits.includes(trait)) {
        return prevSelectedTraits.filter(t => t !== trait);
      } else {
        return [...prevSelectedTraits, trait];
      }
    });
  };

  // Notify parent component about changes
  React.useEffect(() => {
    onTraitsChange(selectedTraits);
  }, [selectedTraits, onTraitsChange]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Personality Traits:</h3>
      {traits.map(trait => (
        <label key={trait} className="block mb-2">
          <input
            type="checkbox"
            value={trait}
            checked={selectedTraits.includes(trait)}
            onChange={() => handleTraitChange(trait)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">{trait}</span>
        </label>
      ))}
    </div>
  );
}

export default PersonalityTraitsChecklist;
