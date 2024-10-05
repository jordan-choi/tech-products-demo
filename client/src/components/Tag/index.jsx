import PropTypes from "prop-types";
import { useState } from "react";

import "./Tag.scss";

export default function Tag({
	children,
	color = "blue",
	onClick,
	clickable = false,
}) {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		setIsSelected((prev) => !prev);
		if (clickable) {
			onClick?.(!isSelected);
		}
	};

	return (
		<button
			className={`tag tag-${color} ${isSelected ? "selected" : ""}`}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === " ") {
					handleClick();
				}
			}}
			role="checkbox"
			aria-checked={isSelected}
			tabIndex={0}
		>
			{children}
		</button>
	);
}

Tag.propTypes = {
	children: PropTypes.node.isRequired,
	color: PropTypes.string,
	onClick: PropTypes.func,
	clickable: PropTypes.bool,
};
