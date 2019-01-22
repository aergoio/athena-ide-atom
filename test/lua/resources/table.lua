local FieldTable = { field1 = "11", ["field2"] = "22", extra = "55" }
FieldTable.field3 = "33"
FieldTable["field4"] = "44"

-- FieldTable. -> field1, field2, field3, field4, extra
-- FieldTable.f -> field1, field2, field3, field4


function mul (arg1, arg2)
  return arg1 * arg2
end
local FuncTable = {
  sum = function (arg1, arg2)
    return arg1 + arg2
  end,
  ["min"] = function (arg1, arg2)
    return arg1 - arg2
  end,
  mul = mul
}
FuncTable.div = function (arg1, arg2)
  return arg1 / arg2
end
function FuncTable.mod (arg1, arg2)
  return arg1 % arg2
end

-- FuncTable. -> all 5 functions
-- FuncTable.s -> sum (arg1, arg2)
-- FuncTable.m -> min (arg2, arg2), mul (arg2, arg2), mod (arg1, arg2)
-- FuncTable.d -> div (arg2, arg2)


local NestedTable = { field1 = "11",
  field2 = {
    subfield1 = "2_11",
    subfield2 = "2_22",
    min = function (arg1, arg2)
      return arg1 - arg2
    end
  }
}
NestedTable.field2.subfield3 = "2_33"
NestedTable.field2["subfield4"] = "2_44"

-- NestedTable. -> field1, field2
-- NestedTable.field2. -> subfield1, subfield2, subfield4, subfield4, min (arg1, arg2)
-- NestedTable.field2.m -> min (arg1, arg2)
