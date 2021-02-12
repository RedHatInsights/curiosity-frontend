import React from 'react';

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext();

/**
 * Expose product context.
 *
 * @returns {*}
 */
const useProductContext = () => React.useContext(ProductContext);

export { ProductContext as default, ProductContext, useProductContext };
