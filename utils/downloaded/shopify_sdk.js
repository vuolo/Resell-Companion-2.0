const fetch = require("node-fetch");

/*
The MIT License (MIT)

Copyright (c) 2016 Shopify Inc.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(d, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : (d.ShopifyBuy = e());
})(this, function() {
  "use strict";
  function d() {
    for (var d = arguments.length, e = Array(d), a = 0; a < d; a++)
      e[a] = arguments[a];
    return e.join(" ");
  }
  function e(d) {
    return (
      !!d && "[object Object]" === Object.prototype.toString.call(d.valueOf())
    );
  }
  function a(d, t) {
    return d(t)
      ? t
      : e(t)
      ? Object.freeze(
          Object.keys(t).reduce(function(e, r) {
            return (e[r] = a(d, t[r])), e;
          }, {})
        )
      : Array.isArray(t)
      ? Object.freeze(
          t.map(function(e) {
            return a(d, e);
          })
        )
      : t;
  }
  function t(d, e) {
    var a =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null,
      t = d.types[e];
    if (t) return t;
    if (a && "INTERFACE" === a.kind) return a;
    throw new Error("No type of " + e + " found in schema");
  }
  function r(d) {
    return Dd.prototype.isPrototypeOf(d);
  }
  function n(d, e, a) {
    return new Dd(d, e, a);
  }
  function i(a) {
    return Dd.prototype.isPrototypeOf(a)
      ? a.toInputValueString()
      : xd.prototype.isPrototypeOf(a)
      ? a + ""
      : Md.prototype.isPrototypeOf(a)
      ? JSON.stringify(a.valueOf())
      : Array.isArray(a)
      ? "[" + d.apply(void 0, Td(a.map(i))) + "]"
      : e(a)
      ? o(a, "{", "}")
      : JSON.stringify(a);
  }
  function o(e) {
    var a = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : "",
      t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : "",
      r = Object.keys(e).map(function(d) {
        return d + ": " + i(e[d]);
      });
    return "" + a + d.apply(void 0, Td(r)) + t;
  }
  function c(d) {
    return Object.keys(d).length ? " (" + o(d) + ")" : "";
  }
  function s(d) {
    var e = Bd,
      a = {},
      t = null;
    if (!(2 === d.length))
      1 === d.length &&
        (zd.prototype.isPrototypeOf(d[0])
          ? (t = d[0])
          : "function" == typeof d[0]
          ? (e = d[0])
          : (a = d[0]));
    else if ("function" == typeof d[1]) {
      var r = Ud(d, 2);
      (a = r[0]), (e = r[1]);
    } else {
      var n = Ud(d, 2);
      (a = n[0]), (t = n[1]);
    }
    return { options: a, selectionSet: t, callback: e };
  }
  function u(d) {
    return d.some(function(d) {
      if (qd.prototype.isPrototypeOf(d)) return "id" === d.name;
      return (
        Jd.prototype.isPrototypeOf(d) &&
        d.selectionSet.typeSchema.implementsNode &&
        u(d.selectionSet.selections)
      );
    });
  }
  function l(d) {
    return d.some(function(d) {
      if (qd.prototype.isPrototypeOf(d)) return "__typename" === d.name;
      return (
        Jd.prototype.isPrototypeOf(d) &&
        d.selectionSet.typeSchema.implementsNode &&
        l(d.selectionSet.selections)
      );
    });
  }
  function p(d) {
    function e(d, e, a) {
      Array.isArray(d[e]) ? d[e].push(a) : (d[e] = [a]);
    }
    var a = d.reduce(function(d, a) {
      if (a.responseKey) e(d, a.responseKey, a);
      else {
        var t = Object.keys(a.selectionSet.selectionsByResponseKey);
        t.forEach(function(t) {
          e(d, t, a);
        });
      }
      return d;
    }, {});
    return (
      Object.keys(a).forEach(function(d) {
        Object.freeze(a[d]);
      }),
      Object.freeze(a)
    );
  }
  function m(d) {
    var e, a, t;
    if (3 === d.length) {
      var r = Ud(d, 3);
      (e = r[0]), (a = r[1]), (t = r[2]);
    } else 2 === d.length ? ("[object String]" === Object.prototype.toString.call(d[0]) ? ((e = d[0]), (a = null)) : Array.isArray(d[0]) && ((a = d[0]), (e = null)), (t = d[1])) : ((t = d[0]), (e = null));
    return { name: e, variables: a, selectionSetCallback: t };
  }
  function g(d) {
    return d.isAnonymous;
  }
  function y(d) {
    return d.some(g);
  }
  function h(d) {
    var e = d.map(function(d) {
      return d.name;
    });
    return e.reduce(function(d, a, t) {
      return d || e.indexOf(a) !== t;
    }, !1);
  }
  function C(d, e) {
    for (
      var a = arguments.length, t = Array(2 < a ? a - 2 : 0), r = 2;
      r < a;
      r++
    )
      t[r - 2] = arguments[r];
    return Xd.prototype.isPrototypeOf(t[0])
      ? t[0]
      : "query" === e
      ? new (Function.prototype.bind.apply($d, [null].concat([d], t)))()
      : new (Function.prototype.bind.apply(Yd, [null].concat([d], t)))();
  }
  function f(d) {
    return 1 !== d.length && (y(d) || h(d));
  }
  function F(d, e) {
    return d.some(function(d) {
      return d.name === e;
    });
  }
  function P(d) {
    return (
      "[object Null]" !== Object.prototype.toString.call(d) &&
      "[object Undefined]" !== Object.prototype.toString.call(d)
    );
  }
  function A(d) {
    return d.selection.selectionSet.typeSchema.implementsNode;
  }
  function k(d) {
    return d.selection.selectionSet.typeSchema.name.endsWith("Connection");
  }
  function V(d) {
    return null == d ? null : A(d) ? d : V(d.parent);
  }
  function v(d) {
    return d.parent ? v(d.parent).concat(d) : [d];
  }
  function _(d) {
    return d.selection.selectionSet.typeSchema.implementsNode
      ? [d]
      : _(d.parent).concat(d);
  }
  function I(d, e) {
    var a = e[e.length - 1],
      t = a.selection.args.first,
      i = Object.keys(a.selection.args)
        .filter(function(d) {
          return r(a.selection.args[d]);
        })
        .map(function(d) {
          return a.selection.args[d];
        }),
      o = i.find(function(d) {
        return "first" === d.name;
      });
    o || ((o = n("first", "Int", t)), i.push(o));
    var c = new Zd(d.selection.selectionSet.typeBundle);
    return [c, i, o];
  }
  function S(d, e, a, t) {
    var i = e.shift();
    if ((a.push(i.selection.responseKey), e.length))
      d.add(
        i.selection.name,
        { alias: i.selection.alias, args: i.selection.args },
        function(d) {
          S(d, e, a, t);
        }
      );
    else {
      var o,
        c = i.selection.selectionSet.selections.find(function(d) {
          return "edges" === d.name;
        }),
        s = c.selectionSet.selections.find(function(d) {
          return "node" === d.name;
        });
      o = r(i.selection.args.first)
        ? i.selection.args.first
        : n("first", "Int", i.selection.args.first);
      var u = {
        alias: i.selection.alias,
        args: Object.assign({}, i.selection.args, { after: t, first: o })
      };
      d.addConnection(i.selection.name, u, s.selectionSet);
    }
  }
  function b(d) {
    return d.reduce(function(d, e) {
      return (
        wd.prototype.isPrototypeOf(e) && d.push(e.toDefinition()),
        d.push.apply(d, Td(b(e.selectionSet.selections))),
        d
      );
    }, []);
  }
  function O(d, e) {
    var a = V(d);
    return a
      ? function() {
          var t,
            r = [],
            n = a.selection.selectionSet.typeSchema,
            i = a.responseData.id,
            o = _(d),
            c = I(d, o),
            s = Ud(c, 2),
            u = s[0],
            l = s[1];
          u.addQuery(l, function(d) {
            r.push("node"),
              d.add("node", { args: { id: i } }, function(d) {
                d.addInlineFragmentOn(n.name, function(d) {
                  S(d, o.slice(1), r, e);
                });
              });
          });
          var p = b(u.operations[0].selectionSet.selections);
          return (t = u.definitions).unshift.apply(t, Td(p)), [u, r];
        }
      : function() {
          var a,
            t = [],
            r = v(d),
            n = I(d, r),
            i = Ud(n, 2),
            o = i[0],
            c = i[1];
          o.addQuery(c, function(d) {
            S(d, r.slice(1), t, e);
          });
          var s = b(o.operations[0].selectionSet.selections);
          return (a = o.definitions).unshift.apply(a, Td(s)), [o, t];
        };
  }
  function E(d, e) {
    return e === d.edges[d.edges.length - 1]
      ? d.pageInfo.hasNextPage
      : new Md(!0);
  }
  function U(d, e) {
    return e === d.edges[0] ? d.pageInfo.hasPreviousPage : new Md(!0);
  }
  function T(d) {
    return function(e, a) {
      if (k(e)) {
        if (
          !(
            a.pageInfo &&
            a.pageInfo.hasOwnProperty("hasNextPage") &&
            a.pageInfo.hasOwnProperty("hasPreviousPage")
          )
        )
          throw new Error(
            'Connections must include the selections "pageInfo { hasNextPage, hasPreviousPage }".'
          );
        return a.edges.map(function(t) {
          return Object.assign(t.node, {
            nextPageQueryAndPath: O(e, t.cursor),
            hasNextPage: E(a, t),
            hasPreviousPage: U(a, t),
            variableValues: d
          });
        });
      }
      return a;
    };
  }
  function D(d, e) {
    return d.responseData.map(function(a) {
      return M(d.contextForArrayItem(a), e);
    });
  }
  function x(d, e) {
    return Object.keys(d.responseData).reduce(function(a, t) {
      return (a[t] = M(d.contextForObjectProperty(t), e)), a;
    }, {});
  }
  function N(d, e, a) {
    return d.reduce(function(d, a) {
      return a(e, d);
    }, a);
  }
  function M(d, a) {
    var t = d.responseData;
    return Array.isArray(t) ? (t = D(d, a)) : e(t) && (t = x(d, a)), N(a, d, t);
  }
  function B(d, e) {
    return (
      P(e) &&
        A(d) &&
        (e.refetchQuery = function() {
          return new $d(d.selection.selectionSet.typeBundle, function(e) {
            e.add("node", { args: { id: d.responseData.id } }, function(e) {
              e.addInlineFragmentOn(
                d.selection.selectionSet.typeSchema.name,
                d.selection.selectionSet
              );
            });
          });
        }),
      e
    );
  }
  function L(d) {
    return function(a, t) {
      if (e(t)) {
        var r = d.classForType(a.selection.selectionSet.typeSchema.name);
        return new r(t);
      }
      return t;
    };
  }
  function R(d, e) {
    if (P(e)) {
      if ("SCALAR" === d.selection.selectionSet.typeSchema.kind)
        return new Md(e);
      if ("ENUM" === d.selection.selectionSet.typeSchema.kind) return new xd(e);
    }
    return e;
  }
  function G(d, e) {
    var a = d.selection.selectionSet,
      r = a.typeBundle,
      n = a.typeSchema;
    return (
      P(e) && (e.__typename ? (e.type = t(r, e.__typename, n)) : (e.type = n)),
      e
    );
  }
  function Q(d) {
    var e = d.classRegistry,
      a = e === void 0 ? new ee() : e,
      t = d.variableValues;
    return [R, B, T(t), G, L(a)];
  }
  function q(d, e) {
    var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : {},
      t = a.transformers || Q(a),
      r = new ae(d, e);
    return M(r, t);
  }
  function J(d) {
    var e = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : {};
    return function(a, t) {
      return fetch(
        d,
        bd({ body: JSON.stringify(a), method: "POST", mode: "cors" }, e, {
          headers: bd(
            { "Content-Type": "application/json", Accept: "application/json" },
            e.headers,
            t
          )
        })
      ).then(function(d) {
        var e = d.headers.get("content-type");
        return -1 < e.indexOf("application/json")
          ? d.json()
          : d.text().then(function(d) {
              return { text: d };
            });
      });
    };
  }
  function W(d) {
    return d && d.length && d[d.length - 1].hasNextPage;
  }
  function w(d) {
    var e = d.split(".");
    return function(d) {
      var a = d.model,
        t = d.errors;
      return new Promise(function(d, r) {
        try {
          var n = e.reduce(function(d, e) {
            return d[e];
          }, a);
          d(n);
        } catch (d) {
          t ? r(t) : r(ie);
        }
      });
    };
  }
  function K(d, e) {
    var a = [].concat(d);
    return Promise.all(
      a.reduce(function(d, a) {
        return null === a
          ? d
          : (d.push(
              e.fetchAllPages(a.images, { pageSize: 250 }).then(function(d) {
                a.attrs.images = d;
              })
            ),
            d.push(
              e.fetchAllPages(a.variants, { pageSize: 250 }).then(function(d) {
                a.attrs.variants = d;
              })
            ),
            d);
      }, [])
    );
  }
  function z(d) {
    return function(e) {
      return K(e, d).then(function() {
        return e;
      });
    };
  }
  function j(d) {
    return function(e) {
      var a = [].concat(e);
      return Promise.all(
        a.reduce(function(e, a) {
          return e.concat(K(a.products, d));
        }, [])
      ).then(function() {
        return e;
      });
    };
  }
  function H(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.id = d.variable("id", "ID!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      e.addQuery([t.__defaultOperation__.id], function(d) {
        d.add("node", { args: { id: t.__defaultOperation__.id } }, function(d) {
          d.addFragment(a.ProductFragment);
        });
      }),
      e
    );
  }
  function X(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.ids = d.variable("ids", "[ID!]!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      e.addQuery([t.__defaultOperation__.ids], function(d) {
        d.add("nodes", { args: { ids: t.__defaultOperation__.ids } }, function(
          d
        ) {
          d.addFragment(a.ProductFragment);
        });
      }),
      e
    );
  }
  function $(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.first = d.variable("first", "Int!")),
      (t.__defaultOperation__.query = d.variable("query", "String")),
      (t.__defaultOperation__.sortKey = d.variable(
        "sortKey",
        "ProductSortKeys"
      )),
      (t.__defaultOperation__.reverse = d.variable("reverse", "Boolean")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      e.addQuery(
        [
          t.__defaultOperation__.first,
          t.__defaultOperation__.query,
          t.__defaultOperation__.sortKey,
          t.__defaultOperation__.reverse
        ],
        function(d) {
          d.add(
            "products",
            {
              args: {
                first: t.__defaultOperation__.first,
                query: t.__defaultOperation__.query,
                sortKey: t.__defaultOperation__.sortKey,
                reverse: t.__defaultOperation__.reverse
              }
            },
            function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.ProductFragment);
                    });
                });
            }
          );
        }
      ),
      e
    );
  }
  function Y(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.handle = d.variable("handle", "String!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      e.addQuery([t.__defaultOperation__.handle], function(d) {
        d.add(
          "productByHandle",
          { args: { handle: t.__defaultOperation__.handle } },
          function(d) {
            d.addFragment(a.ProductFragment);
          }
        );
      }),
      e
    );
  }
  function Z(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.id = d.variable("id", "ID!")),
      (a.CollectionFragment = e.defineFragment(
        "CollectionFragment",
        "Collection",
        function(d) {
          d.add("id"),
            d.add("handle"),
            d.add("description"),
            d.add("descriptionHtml"),
            d.add("updatedAt"),
            d.add("title"),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            });
        }
      )),
      e.addQuery([t.__defaultOperation__.id], function(d) {
        d.add("node", { args: { id: t.__defaultOperation__.id } }, function(d) {
          d.addFragment(a.CollectionFragment);
        });
      }),
      e
    );
  }
  function dd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.id = d.variable("id", "ID!")),
      (t.__defaultOperation__.productsFirst = d.variable(
        "productsFirst",
        "Int!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.CollectionFragment = e.defineFragment(
        "CollectionFragment",
        "Collection",
        function(d) {
          d.add("id"),
            d.add("handle"),
            d.add("description"),
            d.add("descriptionHtml"),
            d.add("updatedAt"),
            d.add("title"),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      e.addQuery(
        [t.__defaultOperation__.id, t.__defaultOperation__.productsFirst],
        function(d) {
          d.add("node", { args: { id: t.__defaultOperation__.id } }, function(
            d
          ) {
            d.addFragment(a.CollectionFragment),
              d.addInlineFragmentOn("Collection", function(d) {
                d.add(
                  "products",
                  { args: { first: t.__defaultOperation__.productsFirst } },
                  function(d) {
                    d.add("pageInfo", function(d) {
                      d.add("hasNextPage"), d.add("hasPreviousPage");
                    }),
                      d.add("edges", function(d) {
                        d.add("cursor"),
                          d.add("node", function(d) {
                            d.addFragment(a.ProductFragment);
                          });
                      });
                  }
                );
              });
          });
        }
      ),
      e
    );
  }
  function ed(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.first = d.variable("first", "Int!")),
      (t.__defaultOperation__.query = d.variable("query", "String")),
      (t.__defaultOperation__.sortKey = d.variable(
        "sortKey",
        "CollectionSortKeys"
      )),
      (t.__defaultOperation__.reverse = d.variable("reverse", "Boolean")),
      (a.CollectionFragment = e.defineFragment(
        "CollectionFragment",
        "Collection",
        function(d) {
          d.add("id"),
            d.add("handle"),
            d.add("description"),
            d.add("descriptionHtml"),
            d.add("updatedAt"),
            d.add("title"),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            });
        }
      )),
      e.addQuery(
        [
          t.__defaultOperation__.first,
          t.__defaultOperation__.query,
          t.__defaultOperation__.sortKey,
          t.__defaultOperation__.reverse
        ],
        function(d) {
          d.add(
            "collections",
            {
              args: {
                first: t.__defaultOperation__.first,
                query: t.__defaultOperation__.query,
                sortKey: t.__defaultOperation__.sortKey,
                reverse: t.__defaultOperation__.reverse
              }
            },
            function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.CollectionFragment);
                    });
                });
            }
          );
        }
      ),
      e
    );
  }
  function ad(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.first = d.variable("first", "Int!")),
      (t.__defaultOperation__.query = d.variable("query", "String")),
      (t.__defaultOperation__.sortKey = d.variable(
        "sortKey",
        "CollectionSortKeys"
      )),
      (t.__defaultOperation__.reverse = d.variable("reverse", "Boolean")),
      (t.__defaultOperation__.productsFirst = d.variable(
        "productsFirst",
        "Int!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.CollectionFragment = e.defineFragment(
        "CollectionFragment",
        "Collection",
        function(d) {
          d.add("id"),
            d.add("handle"),
            d.add("description"),
            d.add("descriptionHtml"),
            d.add("updatedAt"),
            d.add("title"),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      e.addQuery(
        [
          t.__defaultOperation__.first,
          t.__defaultOperation__.query,
          t.__defaultOperation__.sortKey,
          t.__defaultOperation__.reverse,
          t.__defaultOperation__.productsFirst
        ],
        function(d) {
          d.add(
            "collections",
            {
              args: {
                first: t.__defaultOperation__.first,
                query: t.__defaultOperation__.query,
                sortKey: t.__defaultOperation__.sortKey,
                reverse: t.__defaultOperation__.reverse
              }
            },
            function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.CollectionFragment),
                        d.add(
                          "products",
                          {
                            args: {
                              first: t.__defaultOperation__.productsFirst
                            }
                          },
                          function(d) {
                            d.add("pageInfo", function(d) {
                              d.add("hasNextPage"), d.add("hasPreviousPage");
                            }),
                              d.add("edges", function(d) {
                                d.add("cursor"),
                                  d.add("node", function(d) {
                                    d.addFragment(a.ProductFragment);
                                  });
                              });
                          }
                        );
                    });
                });
            }
          );
        }
      ),
      e
    );
  }
  function td(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.handle = d.variable("handle", "String!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.ProductFragment = e.defineFragment(
        "ProductFragment",
        "Product",
        function(d) {
          d.add("id"),
            d.add("availableForSale"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("descriptionHtml"),
            d.add("description"),
            d.add("handle"),
            d.add("productType"),
            d.add("title"),
            d.add("vendor"),
            d.add("publishedAt"),
            d.add("onlineStoreUrl"),
            d.add("options", function(d) {
              d.add("name"), d.add("values");
            }),
            d.add("images", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"), d.add("src"), d.add("altText");
                    });
                });
            }),
            d.add("variants", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.addFragment(a.VariantFragment);
                    });
                });
            });
        }
      )),
      (a.CollectionFragment = e.defineFragment(
        "CollectionFragment",
        "Collection",
        function(d) {
          d.add("id"),
            d.add("handle"),
            d.add("description"),
            d.add("descriptionHtml"),
            d.add("updatedAt"),
            d.add("title"),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            });
        }
      )),
      (a.CollectionsProductsFragment = e.defineFragment(
        "CollectionsProductsFragment",
        "Collection",
        function(d) {
          d.add("products", { args: { first: 20 } }, function(d) {
            d.add("pageInfo", function(d) {
              d.add("hasNextPage"), d.add("hasPreviousPage");
            }),
              d.add("edges", function(d) {
                d.add("cursor"),
                  d.add("node", function(d) {
                    d.addFragment(a.ProductFragment);
                  });
              });
          });
        }
      )),
      e.addQuery([t.__defaultOperation__.handle], function(d) {
        d.add(
          "collectionByHandle",
          { args: { handle: t.__defaultOperation__.handle } },
          function(d) {
            d.addFragment(a.CollectionFragment),
              d.addFragment(a.CollectionsProductsFragment);
          }
        );
      }),
      e
    );
  }
  function rd(d) {
    var e = d.document();
    return (
      e.addQuery(function(d) {
        d.add("shop", function(d) {
          d.add("currencyCode"),
            d.add("paymentSettings", function(d) {
              d.add("enabledPresentmentCurrencies");
            }),
            d.add("description"),
            d.add("moneyFormat"),
            d.add("name"),
            d.add("primaryDomain", function(d) {
              d.add("host"), d.add("sslEnabled"), d.add("url");
            });
        });
      }),
      e
    );
  }
  function nd(d) {
    var e = d.document(),
      a = {};
    return (
      (a.PolicyFragment = e.defineFragment(
        "PolicyFragment",
        "ShopPolicy",
        function(d) {
          d.add("id"), d.add("title"), d.add("url"), d.add("body");
        }
      )),
      e.addQuery(function(d) {
        d.add("shop", function(d) {
          d.add("privacyPolicy", function(d) {
            d.addFragment(a.PolicyFragment);
          }),
            d.add("termsOfService", function(d) {
              d.addFragment(a.PolicyFragment);
            }),
            d.add("refundPolicy", function(d) {
              d.addFragment(a.PolicyFragment);
            });
        });
      }),
      e
    );
  }
  function id(d, e) {
    return function(a) {
      var t = a.data,
        r = a.errors,
        n = a.model,
        i = t[d],
        o = n[d];
      return i && i.checkout
        ? e
            .fetchAllPages(o.checkout.lineItems, { pageSize: 250 })
            .then(function(d) {
              return (
                (o.checkout.attrs.lineItems = d),
                (o.checkout.errors = r),
                (o.checkout.userErrors = o.userErrors),
                o.checkout
              );
            })
        : r && r.length
        ? Promise.reject(new Error(JSON.stringify(r)))
        : i && i.checkoutUserErrors && i.checkoutUserErrors.length
        ? Promise.reject(new Error(JSON.stringify(i.checkoutUserErrors)))
        : i && i.userErrors && i.userErrors.length
        ? Promise.reject(new Error(JSON.stringify(i.userErrors)))
        : Promise.reject(
            new Error("The " + d + " mutation failed due to an unknown error.")
          );
    };
  }
  function od(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.id = d.variable("id", "ID!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addQuery([t.__defaultOperation__.id], function(d) {
        d.add("node", { args: { id: t.__defaultOperation__.id } }, function(d) {
          d.addFragment(a.CheckoutFragment);
        });
      }),
      e
    );
  }
  function cd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.input = d.variable(
        "input",
        "CheckoutCreateInput!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation([t.__defaultOperation__.input], function(d) {
        d.add(
          "checkoutCreate",
          { args: { input: t.__defaultOperation__.input } },
          function(d) {
            d.add("userErrors", function(d) {
              d.addFragment(a.UserErrorFragment);
            }),
              d.add("checkoutUserErrors", function(d) {
                d.addFragment(a.CheckoutUserErrorFragment);
              }),
              d.add("checkout", function(d) {
                d.addFragment(a.CheckoutFragment);
              });
          }
        );
      }),
      e
    );
  }
  function sd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.checkoutId = d.variable("checkoutId", "ID!")),
      (t.__defaultOperation__.lineItems = d.variable(
        "lineItems",
        "[CheckoutLineItemInput!]!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        [t.__defaultOperation__.checkoutId, t.__defaultOperation__.lineItems],
        function(d) {
          d.add(
            "checkoutLineItemsAdd",
            {
              args: {
                checkoutId: t.__defaultOperation__.checkoutId,
                lineItems: t.__defaultOperation__.lineItems
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function ud(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.checkoutId = d.variable("checkoutId", "ID!")),
      (t.__defaultOperation__.lineItemIds = d.variable(
        "lineItemIds",
        "[ID!]!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        [t.__defaultOperation__.checkoutId, t.__defaultOperation__.lineItemIds],
        function(d) {
          d.add(
            "checkoutLineItemsRemove",
            {
              args: {
                checkoutId: t.__defaultOperation__.checkoutId,
                lineItemIds: t.__defaultOperation__.lineItemIds
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function ld(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.checkoutId = d.variable("checkoutId", "ID!")),
      (t.__defaultOperation__.lineItems = d.variable(
        "lineItems",
        "[CheckoutLineItemInput!]!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        [t.__defaultOperation__.checkoutId, t.__defaultOperation__.lineItems],
        function(d) {
          d.add(
            "checkoutLineItemsReplace",
            {
              args: {
                checkoutId: t.__defaultOperation__.checkoutId,
                lineItems: t.__defaultOperation__.lineItems
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.CheckoutUserErrorFragment);
              }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function pd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.__defaultOperation__ = {}),
      (t.__defaultOperation__.checkoutId = d.variable("checkoutId", "ID!")),
      (t.__defaultOperation__.lineItems = d.variable(
        "lineItems",
        "[CheckoutLineItemUpdateInput!]!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        [t.__defaultOperation__.checkoutId, t.__defaultOperation__.lineItems],
        function(d) {
          d.add(
            "checkoutLineItemsUpdate",
            {
              args: {
                checkoutId: t.__defaultOperation__.checkoutId,
                lineItems: t.__defaultOperation__.lineItems
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function md(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutAttributesUpdateV2 = {}),
      (t.checkoutAttributesUpdateV2.checkoutId = d.variable(
        "checkoutId",
        "ID!"
      )),
      (t.checkoutAttributesUpdateV2.input = d.variable(
        "input",
        "CheckoutAttributesUpdateV2Input!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutAttributesUpdateV2",
        [
          t.checkoutAttributesUpdateV2.checkoutId,
          t.checkoutAttributesUpdateV2.input
        ],
        function(d) {
          d.add(
            "checkoutAttributesUpdateV2",
            {
              args: {
                checkoutId: t.checkoutAttributesUpdateV2.checkoutId,
                input: t.checkoutAttributesUpdateV2.input
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function gd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutDiscountCodeApplyV2 = {}),
      (t.checkoutDiscountCodeApplyV2.discountCode = d.variable(
        "discountCode",
        "String!"
      )),
      (t.checkoutDiscountCodeApplyV2.checkoutId = d.variable(
        "checkoutId",
        "ID!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutDiscountCodeApplyV2",
        [
          t.checkoutDiscountCodeApplyV2.discountCode,
          t.checkoutDiscountCodeApplyV2.checkoutId
        ],
        function(d) {
          d.add(
            "checkoutDiscountCodeApplyV2",
            {
              args: {
                discountCode: t.checkoutDiscountCodeApplyV2.discountCode,
                checkoutId: t.checkoutDiscountCodeApplyV2.checkoutId
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function yd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutDiscountCodeRemove = {}),
      (t.checkoutDiscountCodeRemove.checkoutId = d.variable(
        "checkoutId",
        "ID!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutDiscountCodeRemove",
        [t.checkoutDiscountCodeRemove.checkoutId],
        function(d) {
          d.add(
            "checkoutDiscountCodeRemove",
            { args: { checkoutId: t.checkoutDiscountCodeRemove.checkoutId } },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function hd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutGiftCardsAppend = {}),
      (t.checkoutGiftCardsAppend.giftCardCodes = d.variable(
        "giftCardCodes",
        "[String!]!"
      )),
      (t.checkoutGiftCardsAppend.checkoutId = d.variable("checkoutId", "ID!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutGiftCardsAppend",
        [
          t.checkoutGiftCardsAppend.giftCardCodes,
          t.checkoutGiftCardsAppend.checkoutId
        ],
        function(d) {
          d.add(
            "checkoutGiftCardsAppend",
            {
              args: {
                giftCardCodes: t.checkoutGiftCardsAppend.giftCardCodes,
                checkoutId: t.checkoutGiftCardsAppend.checkoutId
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function Cd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutGiftCardRemoveV2 = {}),
      (t.checkoutGiftCardRemoveV2.appliedGiftCardId = d.variable(
        "appliedGiftCardId",
        "ID!"
      )),
      (t.checkoutGiftCardRemoveV2.checkoutId = d.variable("checkoutId", "ID!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutGiftCardRemoveV2",
        [
          t.checkoutGiftCardRemoveV2.appliedGiftCardId,
          t.checkoutGiftCardRemoveV2.checkoutId
        ],
        function(d) {
          d.add(
            "checkoutGiftCardRemoveV2",
            {
              args: {
                appliedGiftCardId: t.checkoutGiftCardRemoveV2.appliedGiftCardId,
                checkoutId: t.checkoutGiftCardRemoveV2.checkoutId
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function fd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutEmailUpdateV2 = {}),
      (t.checkoutEmailUpdateV2.checkoutId = d.variable("checkoutId", "ID!")),
      (t.checkoutEmailUpdateV2.email = d.variable("email", "String!")),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutEmailUpdateV2",
        [t.checkoutEmailUpdateV2.checkoutId, t.checkoutEmailUpdateV2.email],
        function(d) {
          d.add(
            "checkoutEmailUpdateV2",
            {
              args: {
                checkoutId: t.checkoutEmailUpdateV2.checkoutId,
                email: t.checkoutEmailUpdateV2.email
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function Fd(d) {
    var e = d.document(),
      a = {},
      t = {};
    return (
      (t.checkoutShippingAddressUpdateV2 = {}),
      (t.checkoutShippingAddressUpdateV2.shippingAddress = d.variable(
        "shippingAddress",
        "MailingAddressInput!"
      )),
      (t.checkoutShippingAddressUpdateV2.checkoutId = d.variable(
        "checkoutId",
        "ID!"
      )),
      (a.VariantFragment = e.defineFragment(
        "VariantFragment",
        "ProductVariant",
        function(d) {
          d.add("id"),
            d.add("title"),
            d.add("price"),
            d.add("priceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentPrices", { args: { first: 20 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.add("price", function(d) {
                      d.add("amount"), d.add("currencyCode");
                    });
                  });
                });
            }),
            d.add("weight"),
            d.add("availableForSale", { alias: "available" }),
            d.add("sku"),
            d.add("compareAtPrice"),
            d.add("compareAtPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("image", function(d) {
              d.add("id"),
                d.add("originalSrc", { alias: "src" }),
                d.add("altText");
            }),
            d.add("selectedOptions", function(d) {
              d.add("name"), d.add("value");
            });
        }
      )),
      (a.DiscountApplicationFragment = e.defineFragment(
        "DiscountApplicationFragment",
        "DiscountApplication",
        function(d) {
          d.add("targetSelection"),
            d.add("allocationMethod"),
            d.add("targetType"),
            d.add("value", function(d) {
              d.addInlineFragmentOn("MoneyV2", function(d) {
                d.add("amount"), d.add("currencyCode");
              }),
                d.addInlineFragmentOn("PricingPercentageValue", function(d) {
                  d.add("percentage");
                });
            }),
            d.addInlineFragmentOn("ManualDiscountApplication", function(d) {
              d.add("title"), d.add("description");
            }),
            d.addInlineFragmentOn("DiscountCodeApplication", function(d) {
              d.add("code"), d.add("applicable");
            }),
            d.addInlineFragmentOn("ScriptDiscountApplication", function(d) {
              d.add("description");
            }),
            d.addInlineFragmentOn("AutomaticDiscountApplication", function(d) {
              d.add("title");
            });
        }
      )),
      (a.AppliedGiftCardFragment = e.defineFragment(
        "AppliedGiftCardFragment",
        "AppliedGiftCard",
        function(d) {
          d.add("amountUsedV2", function(d) {
            d.add("amount"), d.add("currencyCode");
          }),
            d.add("balanceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("presentmentAmountUsed", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("id"),
            d.add("lastCharacters");
        }
      )),
      (a.VariantWithProductFragment = e.defineFragment(
        "VariantWithProductFragment",
        "ProductVariant",
        function(d) {
          d.addFragment(a.VariantFragment),
            d.add("product", function(d) {
              d.add("id"), d.add("handle");
            });
        }
      )),
      (a.UserErrorFragment = e.defineFragment(
        "UserErrorFragment",
        "UserError",
        function(d) {
          d.add("field"), d.add("message");
        }
      )),
      (a.CheckoutUserErrorFragment = e.defineFragment(
        "CheckoutUserErrorFragment",
        "CheckoutUserError",
        function(d) {
          d.add("field"), d.add("message"), d.add("code");
        }
      )),
      (a.MailingAddressFragment = e.defineFragment(
        "MailingAddressFragment",
        "MailingAddress",
        function(d) {
          d.add("id"),
            d.add("address1"),
            d.add("address2"),
            d.add("city"),
            d.add("company"),
            d.add("country"),
            d.add("firstName"),
            d.add("formatted"),
            d.add("lastName"),
            d.add("latitude"),
            d.add("longitude"),
            d.add("phone"),
            d.add("province"),
            d.add("zip"),
            d.add("name"),
            d.add("countryCodeV2", { alias: "countryCode" }),
            d.add("provinceCode");
        }
      )),
      (a.CheckoutFragment = e.defineFragment(
        "CheckoutFragment",
        "Checkout",
        function(d) {
          d.add("id"),
            d.add("ready"),
            d.add("requiresShipping"),
            d.add("note"),
            d.add("paymentDue"),
            d.add("paymentDueV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("webUrl"),
            d.add("orderStatusUrl"),
            d.add("taxExempt"),
            d.add("taxesIncluded"),
            d.add("currencyCode"),
            d.add("totalTax"),
            d.add("totalTaxV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("lineItemsSubtotalPrice", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("subtotalPrice"),
            d.add("subtotalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("totalPrice"),
            d.add("totalPriceV2", function(d) {
              d.add("amount"), d.add("currencyCode");
            }),
            d.add("completedAt"),
            d.add("createdAt"),
            d.add("updatedAt"),
            d.add("email"),
            d.add("discountApplications", { args: { first: 10 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("node", function(d) {
                    d.addFragment(a.DiscountApplicationFragment);
                  });
                });
            }),
            d.add("appliedGiftCards", function(d) {
              d.addFragment(a.AppliedGiftCardFragment);
            }),
            d.add("shippingAddress", function(d) {
              d.addFragment(a.MailingAddressFragment);
            }),
            d.add("shippingLine", function(d) {
              d.add("handle"),
                d.add("price"),
                d.add("priceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("title");
            }),
            d.add("customAttributes", function(d) {
              d.add("key"), d.add("value");
            }),
            d.add("order", function(d) {
              d.add("id"),
                d.add("processedAt"),
                d.add("orderNumber"),
                d.add("subtotalPrice"),
                d.add("subtotalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalShippingPrice"),
                d.add("totalShippingPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalTax"),
                d.add("totalTaxV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("totalPrice"),
                d.add("totalPriceV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("currencyCode"),
                d.add("totalRefunded"),
                d.add("totalRefundedV2", function(d) {
                  d.add("amount"), d.add("currencyCode");
                }),
                d.add("customerUrl"),
                d.add("shippingAddress", function(d) {
                  d.addFragment(a.MailingAddressFragment);
                }),
                d.add("lineItems", { args: { first: 250 } }, function(d) {
                  d.add("pageInfo", function(d) {
                    d.add("hasNextPage"), d.add("hasPreviousPage");
                  }),
                    d.add("edges", function(d) {
                      d.add("cursor"),
                        d.add("node", function(d) {
                          d.add("title"),
                            d.add("variant", function(d) {
                              d.addFragment(a.VariantWithProductFragment);
                            }),
                            d.add("quantity"),
                            d.add("customAttributes", function(d) {
                              d.add("key"), d.add("value");
                            });
                        });
                    });
                });
            }),
            d.add("lineItems", { args: { first: 250 } }, function(d) {
              d.add("pageInfo", function(d) {
                d.add("hasNextPage"), d.add("hasPreviousPage");
              }),
                d.add("edges", function(d) {
                  d.add("cursor"),
                    d.add("node", function(d) {
                      d.add("id"),
                        d.add("title"),
                        d.add("variant", function(d) {
                          d.addFragment(a.VariantWithProductFragment);
                        }),
                        d.add("quantity"),
                        d.add("customAttributes", function(d) {
                          d.add("key"), d.add("value");
                        }),
                        d.add("discountAllocations", function(d) {
                          d.add("allocatedAmount", function(d) {
                            d.add("amount"), d.add("currencyCode");
                          }),
                            d.add("discountApplication", function(d) {
                              d.addFragment(a.DiscountApplicationFragment);
                            });
                        });
                    });
                });
            });
        }
      )),
      e.addMutation(
        "checkoutShippingAddressUpdateV2",
        [
          t.checkoutShippingAddressUpdateV2.shippingAddress,
          t.checkoutShippingAddressUpdateV2.checkoutId
        ],
        function(d) {
          d.add(
            "checkoutShippingAddressUpdateV2",
            {
              args: {
                shippingAddress:
                  t.checkoutShippingAddressUpdateV2.shippingAddress,
                checkoutId: t.checkoutShippingAddressUpdateV2.checkoutId
              }
            },
            function(d) {
              d.add("userErrors", function(d) {
                d.addFragment(a.UserErrorFragment);
              }),
                d.add("checkoutUserErrors", function(d) {
                  d.addFragment(a.CheckoutUserErrorFragment);
                }),
                d.add("checkout", function(d) {
                  d.addFragment(a.CheckoutFragment);
                });
            }
          );
        }
      ),
      e
    );
  }
  function Pd(d) {
    return (
      Object.getOwnPropertyNames(d).forEach(function(e) {
        var a = d[e];
        a &&
          "object" === ("undefined" == typeof a ? "undefined" : Ad(a)) &&
          Pd(a);
      }),
      Object.freeze(d),
      d
    );
  }
  var Ad =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(d) {
            return typeof d;
          }
        : function(d) {
            return d &&
              "function" == typeof Symbol &&
              d.constructor === Symbol &&
              d !== Symbol.prototype
              ? "symbol"
              : typeof d;
          },
    kd = function(d, e) {
      if (!(d instanceof e))
        throw new TypeError("Cannot call a class as a function");
    },
    Vd = (function() {
      function d(d, e) {
        for (var a, t = 0; t < e.length; t++)
          (a = e[t]),
            (a.enumerable = a.enumerable || !1),
            (a.configurable = !0),
            "value" in a && (a.writable = !0),
            Object.defineProperty(d, a.key, a);
      }
      return function(e, a, t) {
        return a && d(e.prototype, a), t && d(e, t), e;
      };
    })(),
    vd = function(d, e) {
      if ("function" != typeof e && null !== e)
        throw new TypeError(
          "Super expression must either be null or a function, not " + typeof e
        );
      (d.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: d,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        e &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(d, e)
            : (d.__proto__ = e));
    },
    _d = function(d, e) {
      if (!d)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return e && ("object" == typeof e || "function" == typeof e) ? e : d;
    },
    Id = function(d, e) {
      if (!(d instanceof e))
        throw new TypeError("Cannot call a class as a function");
    },
    Sd = (function() {
      function d(d, e) {
        for (var a, t = 0; t < e.length; t++)
          (a = e[t]),
            (a.enumerable = a.enumerable || !1),
            (a.configurable = !0),
            "value" in a && (a.writable = !0),
            Object.defineProperty(d, a.key, a);
      }
      return function(e, a, t) {
        return a && d(e.prototype, a), t && d(e, t), e;
      };
    })(),
    bd =
      Object.assign ||
      function(d) {
        for (var e, a = 1; a < arguments.length; a++)
          for (var t in ((e = arguments[a]), e))
            Object.prototype.hasOwnProperty.call(e, t) && (d[t] = e[t]);
        return d;
      },
    Od = function(d, e) {
      if ("function" != typeof e && null !== e)
        throw new TypeError(
          "Super expression must either be null or a function, not " +
            ("undefined" == typeof e ? "undefined" : Ad(e))
        );
      (d.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: d,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        e &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(d, e)
            : (d.__proto__ = e));
    },
    Ed = function(d, e) {
      if (!d)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return e &&
        ("object" === ("undefined" == typeof e ? "undefined" : Ad(e)) ||
          "function" == typeof e)
        ? e
        : d;
    },
    Ud = (function() {
      function d(d, e) {
        var a,
          t = [],
          r = !0,
          n = !1;
        try {
          for (
            var i, o = d[Symbol.iterator]();
            !(r = (i = o.next()).done) &&
            (t.push(i.value), !(e && t.length === e));
            r = !0
          );
        } catch (d) {
          (n = !0), (a = d);
        } finally {
          try {
            !r && o["return"] && o["return"]();
          } finally {
            if (n) throw a;
          }
        }
        return t;
      }
      return function(e, a) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return d(e, a);
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      };
    })(),
    Td = function(d) {
      if (Array.isArray(d)) {
        for (var e = 0, a = Array(d.length); e < d.length; e++) a[e] = d[e];
        return a;
      }
      return Array.from(d);
    },
    Dd = (function() {
      function d(e, a, t) {
        Id(this, d),
          (this.name = e),
          (this.type = a),
          (this.defaultValue = t),
          Object.freeze(this);
      }
      return (
        Sd(d, [
          {
            key: "toInputValueString",
            value: function() {
              return "$" + this.name;
            }
          },
          {
            key: "toString",
            value: function() {
              var d = this.defaultValue ? " = " + i(this.defaultValue) : "";
              return "$" + this.name + ":" + this.type + d;
            }
          }
        ]),
        d
      );
    })(),
    xd = (function() {
      function d(e) {
        Id(this, d), (this.key = e);
      }
      return (
        Sd(d, [
          {
            key: "toString",
            value: function() {
              return this.key;
            }
          },
          {
            key: "valueOf",
            value: function() {
              return this.key.valueOf();
            }
          }
        ]),
        d
      );
    })(),
    Nd = function(d) {
      return new xd(d);
    },
    Md = (function() {
      function d(e) {
        Id(this, d), (this.value = e);
      }
      return (
        Sd(d, [
          {
            key: "toString",
            value: function() {
              return this.value.toString();
            }
          },
          {
            key: "valueOf",
            value: function() {
              return this.value.valueOf();
            }
          },
          {
            key: "unwrapped",
            get: function() {
              return this.value;
            }
          }
        ]),
        d
      );
    })(),
    Bd = function() {},
    Ld = { trackTypeDependency: Bd, trackFieldDependency: Bd },
    Rd = Ld.trackTypeDependency,
    Gd = Ld.trackFieldDependency,
    Qd = Object.freeze({}),
    qd = (function() {
      function d(e, t, n) {
        Id(this, d),
          (this.name = e),
          (this.alias = t.alias || null),
          (this.responseKey = this.alias || this.name),
          (this.args = t.args ? a(r, t.args) : Qd),
          (this.selectionSet = n),
          Object.freeze(this);
      }
      return (
        Sd(d, [
          {
            key: "toString",
            value: function() {
              var d = this.alias ? this.alias + ": " : "";
              return "" + d + this.name + c(this.args) + this.selectionSet;
            }
          }
        ]),
        d
      );
    })(),
    Jd = function d() {
      Id(this, d);
    },
    Wd = (function(d) {
      function e(d, a) {
        Id(this, e);
        var t = Ed(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
        return (t.typeName = d), (t.selectionSet = a), Object.freeze(t), t;
      }
      return (
        Od(e, d),
        Sd(e, [
          {
            key: "toString",
            value: function() {
              return "... on " + this.typeName + this.selectionSet;
            }
          }
        ]),
        e
      );
    })(Jd),
    wd = (function(d) {
      function e(d) {
        Id(this, e);
        var a = Ed(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
        return (
          (a.name = d.name),
          (a.selectionSet = d.selectionSet),
          Object.freeze(a),
          a
        );
      }
      return (
        Od(e, d),
        Sd(e, [
          {
            key: "toString",
            value: function() {
              return "..." + this.name;
            }
          },
          {
            key: "toDefinition",
            value: function() {
              return new Kd(
                this.name,
                this.selectionSet.typeSchema.name,
                this.selectionSet
              );
            }
          }
        ]),
        e
      );
    })(Jd),
    Kd = (function() {
      function d(e, a, t) {
        Id(this, d),
          (this.name = e),
          (this.typeName = a),
          (this.selectionSet = t),
          (this.spread = new wd(this)),
          Object.freeze(this);
      }
      return (
        Sd(d, [
          {
            key: "toString",
            value: function() {
              return (
                "fragment " +
                this.name +
                " on " +
                this.typeName +
                " " +
                this.selectionSet
              );
            }
          }
        ]),
        d
      );
    })(),
    zd = (function() {
      function e(d, a, r) {
        Id(this, e),
          (this.typeSchema = "string" == typeof a ? t(d, a) : a),
          Rd(this.typeSchema.name),
          (this.typeBundle = d),
          (this.selections = []),
          r && r(new jd(this.typeBundle, this.typeSchema, this.selections)),
          (this.typeSchema.implementsNode || "Node" === this.typeSchema.name) &&
            !u(this.selections) &&
            this.selections.unshift(new qd("id", {}, new e(d, "ID"))),
          "INTERFACE" !== this.typeSchema.kind ||
            l(this.selections) ||
            this.selections.unshift(
              new qd("__typename", {}, new e(d, "String"))
            ),
          (this.selectionsByResponseKey = p(this.selections)),
          Object.freeze(this.selections),
          Object.freeze(this);
      }
      return (
        Sd(e, [
          {
            key: "toString",
            value: function() {
              return "SCALAR" === this.typeSchema.kind ||
                "ENUM" === this.typeSchema.kind
                ? ""
                : " { " + d(this.selections) + " }";
            }
          }
        ]),
        e
      );
    })(),
    jd = (function() {
      function d(e, a, t) {
        Id(this, d),
          (this.typeBundle = e),
          (this.typeSchema = a),
          (this.selections = t);
      }
      return (
        Sd(d, [
          {
            key: "hasSelectionWithResponseKey",
            value: function(d) {
              return this.selections.some(function(e) {
                return e.responseKey === d;
              });
            }
          },
          {
            key: "add",
            value: function(d) {
              var e;
              if ("[object String]" === Object.prototype.toString.call(d)) {
                Gd(this.typeSchema.name, d);
                for (
                  var a = arguments.length, t = Array(1 < a ? a - 1 : 0), r = 1;
                  r < a;
                  r++
                )
                  t[r - 1] = arguments[r];
                e = this.field.apply(this, [d].concat(t));
              } else
                qd.prototype.isPrototypeOf(d) &&
                  Gd(this.typeSchema.name, d.name),
                  (e = d);
              if (
                e.responseKey &&
                this.hasSelectionWithResponseKey(e.responseKey)
              )
                throw new Error(
                  "The field name or alias '" +
                    e.responseKey +
                    "' has already been added."
                );
              this.selections.push(e);
            }
          },
          {
            key: "field",
            value: function(d) {
              for (
                var e = arguments.length, a = Array(1 < e ? e - 1 : 0), r = 1;
                r < e;
                r++
              )
                a[r - 1] = arguments[r];
              var n = s(a),
                i = n.options,
                o = n.callback,
                c = n.selectionSet;
              if (!c) {
                if (!this.typeSchema.fieldBaseTypes[d])
                  throw new Error(
                    'No field of name "' +
                      d +
                      '" found on type "' +
                      this.typeSchema.name +
                      '" in schema'
                  );
                var u = t(this.typeBundle, this.typeSchema.fieldBaseTypes[d]);
                c = new zd(this.typeBundle, u, o);
              }
              return new qd(d, i, c);
            }
          },
          {
            key: "inlineFragmentOn",
            value: function(d) {
              var e,
                a =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : Bd;
              return (
                (e = zd.prototype.isPrototypeOf(a)
                  ? a
                  : new zd(this.typeBundle, t(this.typeBundle, d), a)),
                new Wd(d, e)
              );
            }
          },
          {
            key: "addField",
            value: function(d) {
              for (
                var e = arguments.length, a = Array(1 < e ? e - 1 : 0), t = 1;
                t < e;
                t++
              )
                a[t - 1] = arguments[t];
              this.add.apply(this, [d].concat(a));
            }
          },
          {
            key: "addConnection",
            value: function(d) {
              for (
                var e = arguments.length, a = Array(1 < e ? e - 1 : 0), t = 1;
                t < e;
                t++
              )
                a[t - 1] = arguments[t];
              var r = s(a),
                n = r.options,
                i = r.callback,
                o = r.selectionSet;
              this.add(d, n, function(d) {
                d.add("pageInfo", {}, function(d) {
                  d.add("hasNextPage"), d.add("hasPreviousPage");
                }),
                  d.add("edges", {}, function(d) {
                    d.add("cursor"), d.addField("node", {}, o || i);
                  });
              });
            }
          },
          {
            key: "addInlineFragmentOn",
            value: function(d) {
              var e =
                1 < arguments.length && void 0 !== arguments[1]
                  ? arguments[1]
                  : Bd;
              this.add(this.inlineFragmentOn(d, e));
            }
          },
          {
            key: "addFragment",
            value: function(d) {
              this.add(d);
            }
          }
        ]),
        d
      );
    })(),
    Hd = (function() {
      function e(d) {
        Id(this, e),
          (this.variableDefinitions = d ? [].concat(Td(d)) : []),
          Object.freeze(this.variableDefinitions),
          Object.freeze(this);
      }
      return (
        Sd(e, [
          {
            key: "toString",
            value: function() {
              return 0 === this.variableDefinitions.length
                ? ""
                : " (" + d(this.variableDefinitions) + ") ";
            }
          }
        ]),
        e
      );
    })(),
    Xd = (function() {
      function d(e, a) {
        Id(this, d);
        for (
          var r = arguments.length, n = Array(2 < r ? r - 2 : 0), i = 2;
          i < r;
          i++
        )
          n[i - 2] = arguments[i];
        var o = m(n),
          c = o.name,
          s = o.variables,
          u = o.selectionSetCallback;
        (this.typeBundle = e),
          (this.name = c),
          (this.variableDefinitions = new Hd(s)),
          (this.operationType = a),
          "query" === a
            ? ((this.selectionSet = new zd(e, e.queryType, u)),
              (this.typeSchema = t(e, e.queryType)))
            : ((this.selectionSet = new zd(e, e.mutationType, u)),
              (this.typeSchema = t(e, e.mutationType))),
          Object.freeze(this);
      }
      return (
        Sd(d, [
          {
            key: "toString",
            value: function() {
              var d = this.name ? " " + this.name : "";
              return (
                "" +
                this.operationType +
                d +
                this.variableDefinitions +
                this.selectionSet
              );
            }
          },
          {
            key: "isAnonymous",
            get: function() {
              return !this.name;
            }
          }
        ]),
        d
      );
    })(),
    $d = (function(d) {
      function e(d) {
        var a;
        Id(this, e);
        for (
          var t = arguments.length, r = Array(1 < t ? t - 1 : 0), n = 1;
          n < t;
          n++
        )
          r[n - 1] = arguments[n];
        return Ed(
          this,
          (a = e.__proto__ || Object.getPrototypeOf(e)).call.apply(
            a,
            [this, d, "query"].concat(r)
          )
        );
      }
      return Od(e, d), e;
    })(Xd),
    Yd = (function(d) {
      function e(d) {
        var a;
        Id(this, e);
        for (
          var t = arguments.length, r = Array(1 < t ? t - 1 : 0), n = 1;
          n < t;
          n++
        )
          r[n - 1] = arguments[n];
        return Ed(
          this,
          (a = e.__proto__ || Object.getPrototypeOf(e)).call.apply(
            a,
            [this, d, "mutation"].concat(r)
          )
        );
      }
      return Od(e, d), e;
    })(Xd),
    Zd = (function() {
      function e(d) {
        Id(this, e), (this.typeBundle = d), (this.definitions = []);
      }
      return (
        Sd(e, [
          {
            key: "toString",
            value: function() {
              return d(this.definitions);
            }
          },
          {
            key: "addOperation",
            value: function(d) {
              for (
                var e = arguments.length, a = Array(1 < e ? e - 1 : 0), t = 1;
                t < e;
                t++
              )
                a[t - 1] = arguments[t];
              var r = C.apply(void 0, [this.typeBundle, d].concat(a));
              if (f(this.operations.concat(r)))
                throw new Error(
                  "All operations must be uniquely named on a multi-operation document"
                );
              this.definitions.push(r);
            }
          },
          {
            key: "addQuery",
            value: function() {
              for (var d = arguments.length, e = Array(d), a = 0; a < d; a++)
                e[a] = arguments[a];
              this.addOperation.apply(this, ["query"].concat(e));
            }
          },
          {
            key: "addMutation",
            value: function() {
              for (var d = arguments.length, e = Array(d), a = 0; a < d; a++)
                e[a] = arguments[a];
              this.addOperation.apply(this, ["mutation"].concat(e));
            }
          },
          {
            key: "defineFragment",
            value: function(d, e, a) {
              if (F(this.fragmentDefinitions, d))
                throw new Error(
                  "All fragments must be uniquely named on a multi-fragment document"
                );
              var t = new zd(this.typeBundle, e, a),
                r = new Kd(d, e, t);
              return this.definitions.push(r), r.spread;
            }
          },
          {
            key: "operations",
            get: function() {
              return this.definitions.filter(function(d) {
                return Xd.prototype.isPrototypeOf(d);
              });
            }
          },
          {
            key: "fragmentDefinitions",
            get: function() {
              return this.definitions.filter(function(d) {
                return Kd.prototype.isPrototypeOf(d);
              });
            }
          }
        ]),
        e
      );
    })(),
    de = function d(e) {
      var a = this;
      Id(this, d),
        Object.defineProperty(this, "attrs", { value: e, enumerable: !1 }),
        Object.keys(this.attrs)
          .filter(function(d) {
            return !(d in a);
          })
          .forEach(function(d) {
            var t;
            (t =
              null === e[d]
                ? {
                    enumerable: !0,
                    get: function() {
                      return null;
                    }
                  }
                : {
                    enumerable: !0,
                    get: function() {
                      return this.attrs[d].valueOf();
                    }
                  }),
              Object.defineProperty(a, d, t);
          });
    },
    ee = (function() {
      function d() {
        Id(this, d), (this.classStore = {});
      }
      return (
        Sd(d, [
          {
            key: "registerClassForType",
            value: function(d, e) {
              this.classStore[e] = d;
            }
          },
          {
            key: "unregisterClassForType",
            value: function(d) {
              delete this.classStore[d];
            }
          },
          {
            key: "classForType",
            value: function(d) {
              return this.classStore[d] || de;
            }
          }
        ]),
        d
      );
    })(),
    ae = (function() {
      function d(e, a) {
        var t =
          2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        Id(this, d),
          (this.selection = e),
          (this.responseData = a),
          (this.parent = t),
          Object.freeze(this);
      }
      return (
        Sd(d, [
          {
            key: "contextForObjectProperty",
            value: function(e) {
              var a,
                t = this.selection.selectionSet.selectionsByResponseKey[e],
                r = t && t[0];
              if (
                ((a = Jd.prototype.isPrototypeOf(r)
                  ? new d(r, this.responseData, this.parent)
                  : new d(r, this.responseData[e], this)),
                !r)
              )
                throw new Error(
                  'Unexpected response key "' +
                    e +
                    '", not found in selection set: ' +
                    this.selection.selectionSet
                );
              return qd.prototype.isPrototypeOf(r)
                ? a
                : a.contextForObjectProperty(e);
            }
          },
          {
            key: "contextForArrayItem",
            value: function(e) {
              return new d(this.selection, e, this.parent);
            }
          }
        ]),
        d
      );
    })(),
    te = (function() {
      function d(e, a) {
        var t = a.url,
          r = a.fetcherOptions,
          n = a.fetcher,
          i = a.registry,
          o = void 0 === i ? new ee() : i;
        if (
          (Id(this, d), (this.typeBundle = e), (this.classRegistry = o), t && n)
        )
          throw new Error(
            "Arguments not supported: supply either `url` and optional `fetcherOptions` OR use a `fetcher` function for further customization."
          );
        if (t) this.fetcher = J(t, r);
        else if (n) {
          if (r)
            throw new Error(
              "Arguments not supported: when specifying your own `fetcher`, set options through it and not with `fetcherOptions`"
            );
          this.fetcher = n;
        } else
          throw new Error(
            "Invalid arguments: one of `url` or `fetcher` is needed."
          );
      }
      return (
        Sd(d, [
          {
            key: "document",
            value: function() {
              return new Zd(this.typeBundle);
            }
          },
          {
            key: "query",
            value: function() {
              for (var d = arguments.length, e = Array(d), a = 0; a < d; a++)
                e[a] = arguments[a];
              return new (Function.prototype.bind.apply(
                $d,
                [null].concat([this.typeBundle], e)
              ))();
            }
          },
          {
            key: "mutation",
            value: function() {
              for (var d = arguments.length, e = Array(d), a = 0; a < d; a++)
                e[a] = arguments[a];
              return new (Function.prototype.bind.apply(
                Yd,
                [null].concat([this.typeBundle], e)
              ))();
            }
          },
          {
            key: "send",
            value: function(d) {
              var e,
                a =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : null,
                t = this,
                r =
                  2 < arguments.length && void 0 !== arguments[2]
                    ? arguments[2]
                    : null,
                n =
                  3 < arguments.length && void 0 !== arguments[3]
                    ? arguments[3]
                    : null;
              e = Function.prototype.isPrototypeOf(d) ? d(this) : d;
              var i = { query: e.toString() };
              a && (i.variables = a), Object.assign(i, r);
              var o;
              if (Xd.prototype.isPrototypeOf(e)) o = e;
              else {
                var c = e;
                if (1 === c.operations.length) o = c.operations[0];
                else if (r.operationName)
                  o = c.operations.find(function(d) {
                    return d.name === r.operationName;
                  });
                else
                  throw new Error(
                    "\n          A document must contain exactly one operation, or an operationName\n          must be specified. Example:\n\n            client.send(document, null, {operationName: 'myFancyQuery'});\n        "
                  );
              }
              return this.fetcher(i, n).then(function(d) {
                return (
                  d.data &&
                    (d.model = q(o, d.data, {
                      classRegistry: t.classRegistry,
                      variableValues: a
                    })),
                  d
                );
              });
            }
          },
          {
            key: "fetchNextPage",
            value: function(d, e) {
              var a = Array.isArray(d) ? d[d.length - 1] : d;
              var t,
                r = a.nextPageQueryAndPath(),
                n = Ud(r, 2),
                i = n[0],
                o = n[1];
              return (
                (a.variableValues || e) &&
                  (t = Object.assign({}, a.variableValues, e)),
                this.send(i, t).then(function(d) {
                  return (
                    (d.model = o.reduce(function(d, e) {
                      return d[e];
                    }, d.model)),
                    d
                  );
                })
              );
            }
          },
          {
            key: "fetchAllPages",
            value: function(d, e) {
              var a = this,
                t = e.pageSize;
              return W(d)
                ? this.fetchNextPage(d, { first: t }).then(function(e) {
                    var r = e.model,
                      n = d.concat(r);
                    return a.fetchAllPages(n, { pageSize: t });
                  })
                : Promise.resolve(d);
            }
          },
          {
            key: "refetch",
            value: function(d) {
              if (!d)
                throw new Error(
                  "'client#refetch' must be called with a non-null instance of a Node."
                );
              else if (!d.type.implementsNode)
                throw new Error(
                  "'client#refetch' must be called with a type that implements Node. Received " +
                    d.type.name +
                    "."
                );
              return this.send(d.refetchQuery()).then(function(d) {
                var e = d.model;
                return e.node;
              });
            }
          },
          {
            key: "variable",
            value: function(d, e, a) {
              return n(d, e, a);
            }
          },
          {
            key: "enum",
            value: function(d) {
              return Nd(d);
            }
          }
        ]),
        d
      );
    })(),
    re = (function() {
      function d(e) {
        var a = this;
        kd(this, d),
          Object.keys(this.deprecatedProperties).forEach(function(d) {
            e.hasOwnProperty(d) &&
              (console.warn(
                "[ShopifyBuy] Config property " +
                  d +
                  " is deprecated as of v1.0, please use " +
                  a.deprecatedProperties[d] +
                  " instead."
              ),
              (e[a.deprecatedProperties[d]] = e[d]));
          }),
          this.requiredProperties.forEach(function(d) {
            if (e.hasOwnProperty(d)) a[d] = e[d];
            else
              throw new Error("new Config() requires the option '" + d + "'");
          }),
          (this.apiVersion = e.hasOwnProperty("apiVersion")
            ? e.apiVersion
            : "2019-10"),
          e.hasOwnProperty("source") && (this.source = e.source);
      }
      return (
        Vd(d, [
          {
            key: "requiredProperties",
            get: function() {
              return ["storefrontAccessToken", "domain"];
            }
          },
          {
            key: "deprecatedProperties",
            get: function() {
              return {
                accessToken: "storefrontAccessToken",
                apiKey: "storefrontAccessToken"
              };
            }
          }
        ]),
        d
      );
    })(),
    ne = function d(e) {
      kd(this, d), (this.graphQLClient = e);
    },
    ie = [{ message: "an unknown error has occured." }],
    oe = {
      variantForOptions: function(d, e) {
        return d.variants.find(function(d) {
          return d.selectedOptions.every(function(d) {
            return e[d.name] === d.value.valueOf();
          });
        });
      }
    },
    ce = (function(d) {
      function e() {
        return (
          kd(this, e),
          _d(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
          )
        );
      }
      return (
        vd(e, d),
        Vd(e, [
          {
            key: "fetchAll",
            value: function() {
              var d =
                0 < arguments.length && void 0 !== arguments[0]
                  ? arguments[0]
                  : 20;
              return this.graphQLClient
                .send($, { first: d })
                .then(w("products"))
                .then(z(this.graphQLClient));
            }
          },
          {
            key: "fetch",
            value: function(d) {
              return this.graphQLClient
                .send(H, { id: d })
                .then(w("node"))
                .then(z(this.graphQLClient));
            }
          },
          {
            key: "fetchMultiple",
            value: function(d) {
              return this.graphQLClient
                .send(X, { ids: d })
                .then(w("nodes"))
                .then(z(this.graphQLClient));
            }
          },
          {
            key: "fetchByHandle",
            value: function(d) {
              return this.graphQLClient
                .send(Y, { handle: d })
                .then(w("productByHandle"))
                .then(z(this.graphQLClient));
            }
          },
          {
            key: "fetchQuery",
            value: function() {
              var d =
                  0 < arguments.length && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                e = d.first,
                a = void 0 === e ? 20 : e,
                t = d.sortKey,
                r = void 0 === t ? "ID" : t,
                n = d.query,
                i = d.reverse;
              return this.graphQLClient
                .send($, { first: a, sortKey: r, query: n, reverse: i })
                .then(w("products"))
                .then(z(this.graphQLClient));
            }
          },
          {
            key: "helpers",
            get: function() {
              return oe;
            }
          }
        ]),
        e
      );
    })(ne),
    se = (function(d) {
      function e() {
        return (
          kd(this, e),
          _d(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
          )
        );
      }
      return (
        vd(e, d),
        Vd(e, [
          {
            key: "fetchAll",
            value: function() {
              var d =
                0 < arguments.length && void 0 !== arguments[0]
                  ? arguments[0]
                  : 20;
              return this.graphQLClient
                .send(ed, { first: d })
                .then(w("collections"));
            }
          },
          {
            key: "fetchAllWithProducts",
            value: function() {
              var d =
                  0 < arguments.length && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                e = d.first,
                a = void 0 === e ? 20 : e,
                t = d.productsFirst,
                r = void 0 === t ? 20 : t;
              return this.graphQLClient
                .send(ad, { first: a, productsFirst: r })
                .then(w("collections"))
                .then(j(this.graphQLClient));
            }
          },
          {
            key: "fetch",
            value: function(d) {
              return this.graphQLClient.send(Z, { id: d }).then(w("node"));
            }
          },
          {
            key: "fetchWithProducts",
            value: function(d) {
              var e =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                a = e.productsFirst,
                t = void 0 === a ? 20 : a;
              return this.graphQLClient
                .send(dd, { id: d, productsFirst: t })
                .then(w("node"))
                .then(j(this.graphQLClient));
            }
          },
          {
            key: "fetchByHandle",
            value: function(d) {
              return this.graphQLClient
                .send(td, { handle: d })
                .then(w("collectionByHandle"));
            }
          },
          {
            key: "fetchQuery",
            value: function() {
              var d =
                  0 < arguments.length && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                e = d.first,
                a = void 0 === e ? 20 : e,
                t = d.sortKey,
                r = void 0 === t ? "ID" : t,
                n = d.query,
                i = d.reverse;
              return this.graphQLClient
                .send(ed, { first: a, sortKey: r, query: n, reverse: i })
                .then(w("collections"));
            }
          }
        ]),
        e
      );
    })(ne),
    ue = (function(d) {
      function e() {
        return (
          kd(this, e),
          _d(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
          )
        );
      }
      return (
        vd(e, d),
        Vd(e, [
          {
            key: "fetchInfo",
            value: function() {
              return this.graphQLClient.send(rd).then(w("shop"));
            }
          },
          {
            key: "fetchPolicies",
            value: function() {
              return this.graphQLClient.send(nd).then(w("shop"));
            }
          }
        ]),
        e
      );
    })(ne),
    le = (function(d) {
      function e() {
        return (
          kd(this, e),
          _d(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
          )
        );
      }
      return (
        vd(e, d),
        Vd(e, [
          {
            key: "fetch",
            value: function(d) {
              var e = this;
              return this.graphQLClient
                .send(od, { id: d })
                .then(w("node"))
                .then(function(d) {
                  return d
                    ? e.graphQLClient
                        .fetchAllPages(d.lineItems, { pageSize: 250 })
                        .then(function(e) {
                          return (d.attrs.lineItems = e), d;
                        })
                    : null;
                });
            }
          },
          {
            key: "create",
            value: function() {
              var d =
                0 < arguments.length && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              return this.graphQLClient
                .send(cd, { input: d })
                .then(id("checkoutCreate", this.graphQLClient));
            }
          },
          {
            key: "updateAttributes",
            value: function(d) {
              var e =
                1 < arguments.length && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              return this.graphQLClient
                .send(md, { checkoutId: d, input: e })
                .then(id("checkoutAttributesUpdateV2", this.graphQLClient));
            }
          },
          {
            key: "updateEmail",
            value: function(d, e) {
              return this.graphQLClient
                .send(fd, { checkoutId: d, email: e })
                .then(id("checkoutEmailUpdateV2", this.graphQLClient));
            }
          },
          {
            key: "addLineItems",
            value: function(d, e) {
              return this.graphQLClient
                .send(sd, { checkoutId: d, lineItems: e })
                .then(id("checkoutLineItemsAdd", this.graphQLClient));
            }
          },
          {
            key: "addDiscount",
            value: function(d, e) {
              return this.graphQLClient
                .send(gd, { checkoutId: d, discountCode: e })
                .then(id("checkoutDiscountCodeApplyV2", this.graphQLClient));
            }
          },
          {
            key: "removeDiscount",
            value: function(d) {
              return this.graphQLClient
                .send(yd, { checkoutId: d })
                .then(id("checkoutDiscountCodeRemove", this.graphQLClient));
            }
          },
          {
            key: "addGiftCards",
            value: function(d, e) {
              return this.graphQLClient
                .send(hd, { checkoutId: d, giftCardCodes: e })
                .then(id("checkoutGiftCardsAppend", this.graphQLClient));
            }
          },
          {
            key: "removeGiftCard",
            value: function(d, e) {
              return this.graphQLClient
                .send(Cd, { checkoutId: d, appliedGiftCardId: e })
                .then(id("checkoutGiftCardRemoveV2", this.graphQLClient));
            }
          },
          {
            key: "removeLineItems",
            value: function(d, e) {
              return this.graphQLClient
                .send(ud, { checkoutId: d, lineItemIds: e })
                .then(id("checkoutLineItemsRemove", this.graphQLClient));
            }
          },
          {
            key: "replaceLineItems",
            value: function(d, e) {
              return this.graphQLClient
                .send(ld, { checkoutId: d, lineItems: e })
                .then(id("checkoutLineItemsReplace", this.graphQLClient));
            }
          },
          {
            key: "updateLineItems",
            value: function(d, e) {
              return this.graphQLClient
                .send(pd, { checkoutId: d, lineItems: e })
                .then(id("checkoutLineItemsUpdate", this.graphQLClient));
            }
          },
          {
            key: "updateShippingAddress",
            value: function(d, e) {
              return this.graphQLClient
                .send(Fd, { checkoutId: d, shippingAddress: e })
                .then(
                  id("checkoutShippingAddressUpdateV2", this.graphQLClient)
                );
            }
          }
        ]),
        e
      );
    })(ne),
    pe = {
      imageForSize: function(d, e) {
        var a = e.maxWidth,
          t = e.maxHeight,
          r = d.src.split("?"),
          n = r[0],
          i = r[1] ? "?" + r[1] : "",
          o = n.split("."),
          c = o.length - 2;
        return (o[c] = o[c] + "_" + a + "x" + t), "" + o.join(".") + i;
      }
    },
    me = (function(d) {
      function e() {
        return (
          kd(this, e),
          _d(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
          )
        );
      }
      return (
        vd(e, d),
        Vd(e, [
          {
            key: "helpers",
            get: function() {
              return pe;
            }
          }
        ]),
        e
      );
    })(ne),
    ge = { types: {} };
  (ge.types.Boolean = { name: "Boolean", kind: "SCALAR" }),
    (ge.types.String = { name: "String", kind: "SCALAR" }),
    (ge.types.QueryRoot = {
      name: "QueryRoot",
      kind: "OBJECT",
      fieldBaseTypes: {
        collectionByHandle: "Collection",
        collections: "CollectionConnection",
        node: "Node",
        nodes: "Node",
        productByHandle: "Product",
        products: "ProductConnection",
        shop: "Shop"
      },
      implementsNode: !1
    }),
    (ge.types.Node = {
      name: "Node",
      kind: "INTERFACE",
      fieldBaseTypes: {},
      possibleTypes: [
        "AppliedGiftCard",
        "Article",
        "Blog",
        "Checkout",
        "CheckoutLineItem",
        "Collection",
        "Comment",
        "MailingAddress",
        "Metafield",
        "Order",
        "Page",
        "Payment",
        "Product",
        "ProductOption",
        "ProductVariant",
        "ShopPolicy"
      ]
    }),
    (ge.types.ID = { name: "ID", kind: "SCALAR" }),
    (ge.types.DateTime = { name: "DateTime", kind: "SCALAR" }),
    (ge.types.MailingAddress = {
      name: "MailingAddress",
      kind: "OBJECT",
      fieldBaseTypes: {
        address1: "String",
        address2: "String",
        city: "String",
        company: "String",
        country: "String",
        countryCodeV2: "CountryCode",
        firstName: "String",
        formatted: "String",
        id: "ID",
        lastName: "String",
        latitude: "Float",
        longitude: "Float",
        name: "String",
        phone: "String",
        province: "String",
        provinceCode: "String",
        zip: "String"
      },
      implementsNode: !0
    }),
    (ge.types.Float = { name: "Float", kind: "SCALAR" }),
    (ge.types.CountryCode = { name: "CountryCode", kind: "ENUM" }),
    (ge.types.PageInfo = {
      name: "PageInfo",
      kind: "OBJECT",
      fieldBaseTypes: { hasNextPage: "Boolean", hasPreviousPage: "Boolean" },
      implementsNode: !1
    }),
    (ge.types.Int = { name: "Int", kind: "SCALAR" }),
    (ge.types.Order = {
      name: "Order",
      kind: "OBJECT",
      fieldBaseTypes: {
        currencyCode: "CurrencyCode",
        customerUrl: "URL",
        id: "ID",
        lineItems: "OrderLineItemConnection",
        orderNumber: "Int",
        processedAt: "DateTime",
        shippingAddress: "MailingAddress",
        subtotalPrice: "Money",
        subtotalPriceV2: "MoneyV2",
        totalPrice: "Money",
        totalPriceV2: "MoneyV2",
        totalRefunded: "Money",
        totalRefundedV2: "MoneyV2",
        totalShippingPrice: "Money",
        totalShippingPriceV2: "MoneyV2",
        totalTax: "Money",
        totalTaxV2: "MoneyV2"
      },
      implementsNode: !0
    }),
    (ge.types.Money = { name: "Money", kind: "SCALAR" }),
    (ge.types.MoneyV2 = {
      name: "MoneyV2",
      kind: "OBJECT",
      fieldBaseTypes: { amount: "Decimal", currencyCode: "CurrencyCode" },
      implementsNode: !1
    }),
    (ge.types.Decimal = { name: "Decimal", kind: "SCALAR" }),
    (ge.types.CurrencyCode = { name: "CurrencyCode", kind: "ENUM" }),
    (ge.types.URL = { name: "URL", kind: "SCALAR" }),
    (ge.types.DiscountAllocation = {
      name: "DiscountAllocation",
      kind: "OBJECT",
      fieldBaseTypes: {
        allocatedAmount: "MoneyV2",
        discountApplication: "DiscountApplication"
      },
      implementsNode: !1
    }),
    (ge.types.DiscountApplication = {
      name: "DiscountApplication",
      kind: "INTERFACE",
      fieldBaseTypes: {
        allocationMethod: "DiscountApplicationAllocationMethod",
        targetSelection: "DiscountApplicationTargetSelection",
        targetType: "DiscountApplicationTargetType",
        value: "PricingValue"
      },
      possibleTypes: [
        "AutomaticDiscountApplication",
        "DiscountCodeApplication",
        "ManualDiscountApplication",
        "ScriptDiscountApplication"
      ]
    }),
    (ge.types.DiscountApplicationAllocationMethod = {
      name: "DiscountApplicationAllocationMethod",
      kind: "ENUM"
    }),
    (ge.types.DiscountApplicationTargetSelection = {
      name: "DiscountApplicationTargetSelection",
      kind: "ENUM"
    }),
    (ge.types.DiscountApplicationTargetType = {
      name: "DiscountApplicationTargetType",
      kind: "ENUM"
    }),
    (ge.types.PricingValue = { name: "PricingValue", kind: "UNION" }),
    (ge.types.PricingPercentageValue = {
      name: "PricingPercentageValue",
      kind: "OBJECT",
      fieldBaseTypes: { percentage: "Float" },
      implementsNode: !1
    }),
    (ge.types.OrderLineItemConnection = {
      name: "OrderLineItemConnection",
      kind: "OBJECT",
      fieldBaseTypes: { edges: "OrderLineItemEdge", pageInfo: "PageInfo" },
      implementsNode: !1
    }),
    (ge.types.OrderLineItemEdge = {
      name: "OrderLineItemEdge",
      kind: "OBJECT",
      fieldBaseTypes: { cursor: "String", node: "OrderLineItem" },
      implementsNode: !1
    }),
    (ge.types.OrderLineItem = {
      name: "OrderLineItem",
      kind: "OBJECT",
      fieldBaseTypes: {
        customAttributes: "Attribute",
        quantity: "Int",
        title: "String",
        variant: "ProductVariant"
      },
      implementsNode: !1
    }),
    (ge.types.ProductVariant = {
      name: "ProductVariant",
      kind: "OBJECT",
      fieldBaseTypes: {
        availableForSale: "Boolean",
        compareAtPrice: "Money",
        compareAtPriceV2: "MoneyV2",
        id: "ID",
        image: "Image",
        presentmentPrices: "ProductVariantPricePairConnection",
        price: "Money",
        priceV2: "MoneyV2",
        product: "Product",
        selectedOptions: "SelectedOption",
        sku: "String",
        title: "String",
        weight: "Float"
      },
      implementsNode: !0
    }),
    (ge.types.Product = {
      name: "Product",
      kind: "OBJECT",
      fieldBaseTypes: {
        availableForSale: "Boolean",
        createdAt: "DateTime",
        description: "String",
        descriptionHtml: "HTML",
        handle: "String",
        id: "ID",
        images: "ImageConnection",
        onlineStoreUrl: "URL",
        options: "ProductOption",
        productType: "String",
        publishedAt: "DateTime",
        title: "String",
        updatedAt: "DateTime",
        variants: "ProductVariantConnection",
        vendor: "String"
      },
      implementsNode: !0
    }),
    (ge.types.CollectionConnection = {
      name: "CollectionConnection",
      kind: "OBJECT",
      fieldBaseTypes: { edges: "CollectionEdge", pageInfo: "PageInfo" },
      implementsNode: !1
    }),
    (ge.types.CollectionEdge = {
      name: "CollectionEdge",
      kind: "OBJECT",
      fieldBaseTypes: { cursor: "String", node: "Collection" },
      implementsNode: !1
    }),
    (ge.types.Collection = {
      name: "Collection",
      kind: "OBJECT",
      fieldBaseTypes: {
        description: "String",
        descriptionHtml: "HTML",
        handle: "String",
        id: "ID",
        image: "Image",
        products: "ProductConnection",
        title: "String",
        updatedAt: "DateTime"
      },
      implementsNode: !0
    }),
    (ge.types.HTML = { name: "HTML", kind: "SCALAR" }),
    (ge.types.Image = {
      name: "Image",
      kind: "OBJECT",
      fieldBaseTypes: {
        altText: "String",
        id: "ID",
        originalSrc: "URL",
        src: "URL"
      },
      implementsNode: !1
    }),
    (ge.types.ProductConnection = {
      name: "ProductConnection",
      kind: "OBJECT",
      fieldBaseTypes: { edges: "ProductEdge", pageInfo: "PageInfo" },
      implementsNode: !1
    }),
    (ge.types.ProductEdge = {
      name: "ProductEdge",
      kind: "OBJECT",
      fieldBaseTypes: { cursor: "String", node: "Product" },
      implementsNode: !1
    }),
    (ge.types.ImageConnection = {
      name: "ImageConnection",
      kind: "OBJECT",
      fieldBaseTypes: { edges: "ImageEdge", pageInfo: "PageInfo" },
      implementsNode: !1
    }),
    (ge.types.ImageEdge = {
      name: "ImageEdge",
      kind: "OBJECT",
      fieldBaseTypes: { cursor: "String", node: "Image" },
      implementsNode: !1
    }),
    (ge.types.ProductOption = {
      name: "ProductOption",
      kind: "OBJECT",
      fieldBaseTypes: { name: "String", values: "String" },
      implementsNode: !0
    }),
    (ge.types.ProductVariantConnection = {
      name: "ProductVariantConnection",
      kind: "OBJECT",
      fieldBaseTypes: { edges: "ProductVariantEdge", pageInfo: "PageInfo" },
      implementsNode: !1
    }),
    (ge.types.ProductVariantEdge = {
      name: "ProductVariantEdge",
      kind: "OBJECT",
      fieldBaseTypes: { cursor: "String", node: "ProductVariant" },
      implementsNode: !1
    }),
    (ge.types.ProductVariantPricePairConnection = {
      name: "ProductVariantPricePairConnection",
      kind: "OBJECT",
      fieldBaseTypes: {
        edges: "ProductVariantPricePairEdge",
        pageInfo: "PageInfo"
      },
      implementsNode: !1
    }),
    (ge.types.ProductVariantPricePairEdge = {
      name: "ProductVariantPricePairEdge",
      kind: "OBJECT",
      fieldBaseTypes: { node: "ProductVariantPricePair" },
      implementsNode: !1
    }),
    (ge.types.ProductVariantPricePair = {
      name: "ProductVariantPricePair",
      kind: "OBJECT",
      fieldBaseTypes: { price: "MoneyV2" },
      implementsNode: !1
    }),
    (ge.types.SelectedOption = {
      name: "SelectedOption",
      kind: "OBJECT",
      fieldBaseTypes: { name: "String", value: "String" },
      implementsNode: !1
    }),
    (ge.types.Attribute = {
      name: "Attribute",
      kind: "OBJECT",
      fieldBaseTypes: { key: "String", value: "String" },
      implementsNode: !1
    }),
    (ge.types.DiscountApplicationConnection = {
      name: "DiscountApplicationConnection",
      kind: "OBJECT",
      fieldBaseTypes: {
        edges: "DiscountApplicationEdge",
        pageInfo: "PageInfo"
      },
      implementsNode: !1
    }),
    (ge.types.DiscountApplicationEdge = {
      name: "DiscountApplicationEdge",
      kind: "OBJECT",
      fieldBaseTypes: { node: "DiscountApplication" },
      implementsNode: !1
    }),
    (ge.types.Checkout = {
      name: "Checkout",
      kind: "OBJECT",
      fieldBaseTypes: {
        appliedGiftCards: "AppliedGiftCard",
        completedAt: "DateTime",
        createdAt: "DateTime",
        currencyCode: "CurrencyCode",
        customAttributes: "Attribute",
        discountApplications: "DiscountApplicationConnection",
        email: "String",
        id: "ID",
        lineItems: "CheckoutLineItemConnection",
        lineItemsSubtotalPrice: "MoneyV2",
        note: "String",
        order: "Order",
        orderStatusUrl: "URL",
        paymentDue: "Money",
        paymentDueV2: "MoneyV2",
        ready: "Boolean",
        requiresShipping: "Boolean",
        shippingAddress: "MailingAddress",
        shippingLine: "ShippingRate",
        subtotalPrice: "Money",
        subtotalPriceV2: "MoneyV2",
        taxExempt: "Boolean",
        taxesIncluded: "Boolean",
        totalPrice: "Money",
        totalPriceV2: "MoneyV2",
        totalTax: "Money",
        totalTaxV2: "MoneyV2",
        updatedAt: "DateTime",
        webUrl: "URL"
      },
      implementsNode: !0
    }),
    (ge.types.CheckoutLineItemConnection = {
      name: "CheckoutLineItemConnection",
      kind: "OBJECT",
      fieldBaseTypes: { edges: "CheckoutLineItemEdge", pageInfo: "PageInfo" },
      implementsNode: !1
    }),
    (ge.types.CheckoutLineItemEdge = {
      name: "CheckoutLineItemEdge",
      kind: "OBJECT",
      fieldBaseTypes: { cursor: "String", node: "CheckoutLineItem" },
      implementsNode: !1
    }),
    (ge.types.CheckoutLineItem = {
      name: "CheckoutLineItem",
      kind: "OBJECT",
      fieldBaseTypes: {
        customAttributes: "Attribute",
        discountAllocations: "DiscountAllocation",
        id: "ID",
        quantity: "Int",
        title: "String",
        variant: "ProductVariant"
      },
      implementsNode: !0
    }),
    (ge.types.ShippingRate = {
      name: "ShippingRate",
      kind: "OBJECT",
      fieldBaseTypes: {
        handle: "String",
        price: "Money",
        priceV2: "MoneyV2",
        title: "String"
      },
      implementsNode: !1
    }),
    (ge.types.AppliedGiftCard = {
      name: "AppliedGiftCard",
      kind: "OBJECT",
      fieldBaseTypes: {
        amountUsedV2: "MoneyV2",
        balanceV2: "MoneyV2",
        id: "ID",
        lastCharacters: "String",
        presentmentAmountUsed: "MoneyV2"
      },
      implementsNode: !0
    }),
    (ge.types.Shop = {
      name: "Shop",
      kind: "OBJECT",
      fieldBaseTypes: {
        currencyCode: "CurrencyCode",
        description: "String",
        moneyFormat: "String",
        name: "String",
        paymentSettings: "PaymentSettings",
        primaryDomain: "Domain",
        privacyPolicy: "ShopPolicy",
        refundPolicy: "ShopPolicy",
        termsOfService: "ShopPolicy"
      },
      implementsNode: !1
    }),
    (ge.types.PaymentSettings = {
      name: "PaymentSettings",
      kind: "OBJECT",
      fieldBaseTypes: { enabledPresentmentCurrencies: "CurrencyCode" },
      implementsNode: !1
    }),
    (ge.types.Domain = {
      name: "Domain",
      kind: "OBJECT",
      fieldBaseTypes: { host: "String", sslEnabled: "Boolean", url: "URL" },
      implementsNode: !1
    }),
    (ge.types.ShopPolicy = {
      name: "ShopPolicy",
      kind: "OBJECT",
      fieldBaseTypes: { body: "String", id: "ID", title: "String", url: "URL" },
      implementsNode: !0
    }),
    (ge.types.Mutation = {
      name: "Mutation",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkoutAttributesUpdateV2: "CheckoutAttributesUpdateV2Payload",
        checkoutCreate: "CheckoutCreatePayload",
        checkoutDiscountCodeApplyV2: "CheckoutDiscountCodeApplyV2Payload",
        checkoutDiscountCodeRemove: "CheckoutDiscountCodeRemovePayload",
        checkoutEmailUpdateV2: "CheckoutEmailUpdateV2Payload",
        checkoutGiftCardRemoveV2: "CheckoutGiftCardRemoveV2Payload",
        checkoutGiftCardsAppend: "CheckoutGiftCardsAppendPayload",
        checkoutLineItemsAdd: "CheckoutLineItemsAddPayload",
        checkoutLineItemsRemove: "CheckoutLineItemsRemovePayload",
        checkoutLineItemsReplace: "CheckoutLineItemsReplacePayload",
        checkoutLineItemsUpdate: "CheckoutLineItemsUpdatePayload",
        checkoutShippingAddressUpdateV2:
          "CheckoutShippingAddressUpdateV2Payload"
      },
      implementsNode: !1,
      relayInputObjectBaseTypes: {
        checkoutAttributesUpdate: "CheckoutAttributesUpdateInput",
        checkoutAttributesUpdateV2: "CheckoutAttributesUpdateV2Input",
        checkoutCreate: "CheckoutCreateInput",
        customerAccessTokenCreate: "CustomerAccessTokenCreateInput",
        customerActivate: "CustomerActivateInput",
        customerCreate: "CustomerCreateInput",
        customerReset: "CustomerResetInput"
      }
    }),
    (ge.types.UserError = {
      name: "UserError",
      kind: "OBJECT",
      fieldBaseTypes: { field: "String", message: "String" },
      implementsNode: !1
    }),
    (ge.types.CheckoutUserError = {
      name: "CheckoutUserError",
      kind: "OBJECT",
      fieldBaseTypes: {
        code: "CheckoutErrorCode",
        field: "String",
        message: "String"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutErrorCode = { name: "CheckoutErrorCode", kind: "ENUM" }),
    (ge.types.CheckoutAttributesUpdateV2Payload = {
      name: "CheckoutAttributesUpdateV2Payload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutDiscountCodeApplyV2Payload = {
      name: "CheckoutDiscountCodeApplyV2Payload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutCreatePayload = {
      name: "CheckoutCreatePayload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutEmailUpdateV2Payload = {
      name: "CheckoutEmailUpdateV2Payload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutDiscountCodeRemovePayload = {
      name: "CheckoutDiscountCodeRemovePayload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutGiftCardsAppendPayload = {
      name: "CheckoutGiftCardsAppendPayload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutGiftCardRemoveV2Payload = {
      name: "CheckoutGiftCardRemoveV2Payload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutLineItemsAddPayload = {
      name: "CheckoutLineItemsAddPayload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutLineItemsRemovePayload = {
      name: "CheckoutLineItemsRemovePayload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutLineItemsUpdatePayload = {
      name: "CheckoutLineItemsUpdatePayload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.CheckoutLineItemsReplacePayload = {
      name: "CheckoutLineItemsReplacePayload",
      kind: "OBJECT",
      fieldBaseTypes: { checkout: "Checkout", userErrors: "CheckoutUserError" },
      implementsNode: !1
    }),
    (ge.types.CheckoutShippingAddressUpdateV2Payload = {
      name: "CheckoutShippingAddressUpdateV2Payload",
      kind: "OBJECT",
      fieldBaseTypes: {
        checkout: "Checkout",
        checkoutUserErrors: "CheckoutUserError",
        userErrors: "UserError"
      },
      implementsNode: !1
    }),
    (ge.types.DiscountCodeApplication = {
      name: "DiscountCodeApplication",
      kind: "OBJECT",
      fieldBaseTypes: { applicable: "Boolean", code: "String" },
      implementsNode: !1
    }),
    (ge.types.ManualDiscountApplication = {
      name: "ManualDiscountApplication",
      kind: "OBJECT",
      fieldBaseTypes: { description: "String", title: "String" },
      implementsNode: !1
    }),
    (ge.types.ScriptDiscountApplication = {
      name: "ScriptDiscountApplication",
      kind: "OBJECT",
      fieldBaseTypes: { description: "String" },
      implementsNode: !1
    }),
    (ge.types.AutomaticDiscountApplication = {
      name: "AutomaticDiscountApplication",
      kind: "OBJECT",
      fieldBaseTypes: { title: "String" },
      implementsNode: !1
    }),
    (ge.queryType = "QueryRoot"),
    (ge.mutationType = "Mutation"),
    (ge.subscriptionType = null);
  var ye = Pd(ge),
    he = (function() {
      function d(e) {
        var a =
            1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : te,
          t = arguments[2];
        kd(this, d);
        var r = "https://" + e.domain + "/api/" + e.apiVersion + "/graphql",
          n = {
            "X-SDK-Variant": "javascript",
            "X-SDK-Version": "2.8.1",
            "X-Shopify-Storefront-Access-Token": e.storefrontAccessToken
          };
        e.source && (n["X-SDK-Variant-Source"] = e.source),
          t
            ? ((n["Content-Type"] = "application/json"),
              (n.Accept = "application/json"),
              (this.graphQLClient = new a(ye, {
                fetcher: function(d) {
                  return t(r, {
                    body: JSON.stringify(d),
                    method: "POST",
                    mode: "cors",
                    headers: n
                  }).then(function(d) {
                    return d.json();
                  });
                }
              })))
            : (this.graphQLClient = new a(ye, {
                url: r,
                fetcherOptions: { headers: n }
              })),
          (this.product = new ce(this.graphQLClient)),
          (this.collection = new se(this.graphQLClient)),
          (this.shop = new ue(this.graphQLClient)),
          (this.checkout = new le(this.graphQLClient)),
          (this.image = new me(this.graphQLClient));
      }
      return (
        Vd(d, null, [
          {
            key: "buildClient",
            value: function(e, a) {
              var t = new re(e),
                r = new d(t, te, a);
              return (r.config = t), r;
            }
          }
        ]),
        Vd(d, [
          {
            key: "fetchNextPage",
            value: function(d) {
              return this.graphQLClient.fetchNextPage(d);
            }
          }
        ]),
        d
      );
    })();
  return he;
});
