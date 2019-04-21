import "./library.lua"

function constructor(key, arg1, arg2)
  system.setItem(key, {intVal=arg1, stringVal=arg2})
end

function setItemWithTable(key, table)
  system.setItem(key, { intVal=table.intVal, stringVal=table.stringVal })
end

function set(key, arg1, arg2)
  system.setItem(key, {intVal=arg1, stringVal=arg2 })
end

function get(key)
  return system.getItem(key)
end

abi.register(libraryFunc, set, setItemWithTable)
abi.register_view(get)
