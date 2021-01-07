const removeSensitiveFields = (dataContent) => {
  const content = dataContent;
  if (content instanceof Array) {
    content.forEach((contentEntity) => {
      delete contentEntity._id;
      delete contentEntity.password;
      return contentEntity;
    });
  } else {
    delete content._id;
    delete content.password;
  }
  return content;
};

class ResponseData {
  constructor(content) {
    this.type = content instanceof Array ? 'list' : 'entity';
    this.content = removeSensitiveFields(content);
  }
}

module.exports = ResponseData;

// const data = {
//   data: {
//     type: "list",
//     content: {
//       name: 'barriaza',
//       email: 'barriaza@gmail.com',
//       password: 'barriazaPass',
//     },
//     pageable: {
//       sort: {
//         sorted: true,
//         unsorted: false,
//       },
//       offset: 0,
//       pageNumber: 2,
//       pageSize: 10,
//     },
//     totalPages: 15,
//     totalElements: 150,
//     hasLastPage: false,
//     lastPage: 10,
//     page: 2,
//     hasNextPage: true,
//     hasPreviousPage: true,
//     nextPage: true,
//     previousPage: true,
//   },
// };
