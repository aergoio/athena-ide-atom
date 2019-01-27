import "./library.lua"

variable1 = 1
local variable2 = "2"
local variable3

-- v : variable1, variable2, variable3

function func1 (arg1, arg2)
  local variable4 = nil

  -- v : variable1, variable2, variable3, variable4
  -- a : arg1, arg2
  -- f : func1 (arg1, arg2)

  -- if v -> v_
  -- for a -> a_
  -- while f -> f_

  return arg1 + arg2
end

-- v : variable1, variable2, variable3
-- fun : func1 (arg1, arg2)

variable5 = { field = 3 }
local func2 = function (arg3, arg4)

  -- v : variable1, variable2, variable3, variable5
  -- a : arg3, arg4
  -- f : func1 (arg1, arg2), func2 (arg3, arg4)

  -- if v -> v_
  -- for a -> a_
  -- while f -> f_

  return arg1 + arg2
end

-- v : variable1, variable2, variable3, variable5
-- fun : func1 (arg1, arg2), func2(arg1, arg2)

function func3 ()

  -- v : variable1, variable2, variable3, variable5
  -- a : ""
  -- f : func1 (arg1, arg2), func2 (arg3, arg4), func3 ()

  -- if v -> v_
  -- for a -> a_
  -- while f -> f_

  return 3
end

-- v : variable1, variable2, variable3, variable5
-- fun : func1 (arg1, arg2), func2(arg1, arg2), func3 ()


-- l : libraryVariable, libraryFunc, libraryTable
