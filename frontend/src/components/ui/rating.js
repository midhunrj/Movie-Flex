import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RatingGroup } from "@chakra-ui/react";
import * as React from "react";
export const Rating = React.forwardRef(function Rating(props, ref) {
    const { icon, count = 5, label, ...rest } = props;
    return (_jsxs(RatingGroup.Root, { ref: ref, count: count, ...rest, children: [label && _jsx(RatingGroup.Label, { children: label }), _jsx(RatingGroup.HiddenInput, {}), _jsx(RatingGroup.Control, { children: Array.from({ length: count }).map((_, index) => (_jsx(RatingGroup.Item, { index: index + 1, children: _jsx(RatingGroup.ItemIndicator, { icon: icon }) }, index))) })] }));
});
