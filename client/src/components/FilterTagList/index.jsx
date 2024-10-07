import PropTypes from "prop-types";
import { useState } from "react";

import Tag from "../Tag";

import "./FilterTagList.scss";

export default function FilterTagList({ topics, onChange }) {
	const [selectedTopics, setSelectedTopics] = useState([]);

	const handleTopicClick = (topicId, selected) => {
		const newSelectedTopics = selected
			? [...selectedTopics, topicId]
			: selectedTopics.filter((topic) => topic !== topicId);

		setSelectedTopics(newSelectedTopics);
		onChange?.(newSelectedTopics);
	};

	return (
		<ul className="topic-list">
			{topics.length === 0 && (
				<li className="no-topic">
					<em>No topic to show.</em>
				</li>
			)}
			{topics.map(({ id, name }) => (
				<li key={id}>
					<Tag clickable onClick={(selected) => handleTopicClick(id, selected)}>
						{name}
					</Tag>
				</li>
			))}
		</ul>
	);
}

FilterTagList.propTypes = {
	topics: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	).isRequired,
	onChange: PropTypes.func,
};
