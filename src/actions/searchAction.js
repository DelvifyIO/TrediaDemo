import {
  SET_QUERY,
  SET_SEARCHING_STATUS,
  SET_RESULT,
  SET_FILTERS,
  SET_IMAGE,
} from "./types";
import { stringify } from 'qs';

import data from '../assets/data/zipper';
import {SEARCH_STATUS} from "../utils/enum";

export const setQuery = (query) => dispatch => {
  dispatch({
    type: SET_QUERY,
    payload: { query },
  });
  return Promise.resolve();
};

export const setImage = (image) => dispatch => {
  dispatch({
    type: SET_IMAGE,
    payload: { image },
  });
  return Promise.resolve();
};

export const setSearchingStatus = (status) => dispatch => {
  dispatch({
    type: SET_SEARCHING_STATUS,
    payload: { status },
  });
  return Promise.resolve();
};

export const setResult = (result) => dispatch => {
  dispatch({
    type: SET_RESULT,
    payload: { result },
  });
  return Promise.resolve();
};

export const setFilters = (filters) => dispatch => {
  dispatch({
    type: SET_FILTERS,
    payload: { filters },
  });
  return Promise.resolve();
};

export const searchImage = (image) => dispatch => {
  dispatch(setImage(image));
  dispatch(setQuery(null));
  dispatch(setResult([]));
  const formData = new FormData();
  formData.append('file', image);
  let req = new XMLHttpRequest();

  req.onreadystatechange = function(e) {
    if (req.readyState == 4 && req.status == 200) {
      const result = JSON.parse(req.responseText);
      const results = result.skus.map((sku) => `https://fashion-demo-assets.s3-ap-southeast-1.amazonaws.com/${sku}`);
      // const results = result.skus.map((sku) => `https://imagesearchdelvify.s3.amazonaws.com/${sku}`);

      console.log(`Image Search: ${image.name}`, result);
      dispatch(setSearchingStatus(SEARCH_STATUS.SUCCESS));
      dispatch(setResult(results));
    } else if (req.readyState >= 400) {
      dispatch(setSearchingStatus(SEARCH_STATUS.ERROR));
    }

  };
  req.open("POST", 'http://13.67.88.182:5000/get_imageskus/');
  // req.open("POST", 'http://ubuntu@ec2-18-162-113-148.ap-east-1.compute.amazonaws.com:5000/get_imageskus/');
  req.send(formData);
};

export const search = (query) => dispatch => {
  dispatch(setQuery(query));
  dispatch(setImage(null));
  dispatch(setResult([]));
  // const like = (keyword, string) => {
  //   return string.toLowerCase().split(' ').includes(keyword.toLowerCase());
  // };
  //
  // const match = (query, string) => {
  //   let points = 0;
  //   query.split(' ').forEach((keyword) => {
  //     if (like(keyword, string)) {
  //       points ++;
  //     }
  //   });
  //   return points;
  // };

  // const resultTemp = data.map((datum) => {
  //   const points =
  //       match(query, datum.description) +
  //       match(query, datum.brand) +
  //       match(query, datum.name) +
  //       datum.use.reduce((sum, use) => sum + match(query, use), 0) +
  //       datum.feature.reduce((sum, feature) => sum + match(query, feature), 0) +
  //       datum.tapeColor.reduce((sum, tapeColor) => sum + match(query, tapeColor), 0) +
  //       datum.teethColor.reduce((sum, teethColor) => sum + match(query, teethColor), 0) +
  //       datum.material.reduce((sum, material) => sum + match(query, material), 0);
  //   return { points, datum };
  // });
  // resultTemp.sort((a, b) => b.points - a.points);
  // const result = resultTemp.filter((datum) => datum.points > 0).map((datum) => datum.datum).slice(0, 18);

  fetch(`http://13.67.88.182:5001/computeSimilarity?text=${query}`)
      .then((result) => {
        return result.json();
      })
      .then((result) => {
        // response.sku.forEach((index) => {
        //   result.push(data[parseInt(index) - 1]);
        // });

        // const filters = {
        //   brands: {},
        //   materials: {},
        //   features: {},
        //   origins: {},
        //   usages: {},
        //   sizes: {},
        //   tapeColors: {},
        //   teethColors: {},
        // };
        // result.forEach((item) => {
        //   filters.brands[item.brand] = true;
        //   // if (!filters.brands.includes(item.brand)) filters.brands.push(item.brand);
        //   item.material.forEach((material) => {
        //     filters.materials[material] = true;
        //     // if (!filters.materials.includes(material)) filters.materials.push(material);
        //   });
        //   item.feature.forEach((feature) => {
        //     filters.features[feature] = true;
        //     // if (!filters.features.includes(feature)) filters.features.push(feature);
        //   });
        //   filters.origins[item.origin] = true;
        //   // if (!filters.origins.includes(item.origin)) filters.origins.push(item.origin);
        //   item.use.forEach((use) => {
        //     filters.usages[use] = true;
        //     // if (!filters.usages.includes(use)) filters.usages.push(use);
        //   });
        //   item.size.forEach((size) => {
        //     filters.sizes[size] = true;
        //     // if (!filters.sizes.includes(size)) filters.sizes.push(size);
        //   });
        //   item.tapeColor.forEach((tapeColor) => {
        //     filters.tapeColors[tapeColor] = true;
        //     // if (!filters.tapeColors.includes(tapeColor)) filters.tapeColors.push(tapeColor);
        //   });
        //   item.teethColor.forEach((teethColor) => {
        //     filters.teethColors[teethColor] = true;
        //     // if (!filters.teethColors.includes(teethColor)) filters.teethColors.push(teethColor);
        //   });
        // });

        const results = result.skus.map((sku) => `https://fashion-demo-assets.s3-ap-southeast-1.amazonaws.com/${sku}.jpg`);


        dispatch(setSearchingStatus(SEARCH_STATUS.SUCCESS));
        dispatch(setResult(results));
        // dispatch(setFilters(filters));
        console.log(`Query Search: ${query}`, result);
      })
      .catch(() => {
        dispatch(setSearchingStatus(SEARCH_STATUS.ERROR));
      });
  

};

