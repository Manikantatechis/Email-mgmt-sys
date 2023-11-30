import PropTypes from 'prop-types';

// third-party
import { motion } from 'framer-motion';

// ==============================|| ANIMATION BUTTON ||============================== //

export default function AnimateButton({ children,  type }) {
  let animationProps = {};
  switch (type) {
    case 'rotate':
      animationProps = { whileHover: { rotate: 360 }, whileTap: { rotate: 0 } };
      break;
    case 'slide':
      animationProps = { whileHover: { x: 5 }, whileTap: { x: 0 } };
      break;
    case 'scale':
      animationProps = { whileHover: { scale: 1 }, whileTap: { scale: 0.9 } };
      break;
    default:
      animationProps = { whileHover: { scale: 1 }, whileTap: { scale: 0.9 } };
      break;
  }


  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
  
}

AnimateButton.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['slide', 'scale', 'rotate'])
};

AnimateButton.defaultProps = {
  type: 'scale'
};
