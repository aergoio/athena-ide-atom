import "./library.lua"

local FieldTable = { field1 = "11", ["field2"] = "22", [33] = "33", withoutInit}
FieldTable.field4 = "44"
FieldTable["field5"] = "55"
FieldTable[66] = "66"
FieldTable2 = { field1 = "11", ["field2"] = "22" }
FieldTable3 = { }

-- FieldTable. -> field1, field2, field4, field5, withoutInit
-- FieldTable.f -> field1, field2, field4, field5
-- FieldTable2.f -> field1, field2


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
-- FuncTable.s -> sum
-- FuncTable.m -> min, mul, mod
-- FuncTable.d -> div


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
-- NestedTable.field2. -> subfield1, subfield2, subfield4, subfield4, min
-- NestedTable.field2.m -> min


-- libraryTable. -> field1, field2
