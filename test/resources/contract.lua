import "./library.lua"

function constructor(key, arg1, arg2)
  if key ~= nil then
    system.setItem(key, {intVal=arg1, stringVal=arg2})
  end
end

function set(key, arg1, arg2)
  system.setItem(key, {intVal=arg1, stringVal=arg2})
end

function event(key, arg1, arg2)
  contract.event("event", key, arg1, arg2)
end

function set(key, arg1, arg2)
  system.setItem(key, {intVal=arg1, stringVal=arg2})
end

function get(key)
  return system.getItem(key)
end

function check_delegation(functionName, args)
  return true
end

abi.register(libraryFunc)
abi.payable(set, constructor)
abi.register_view(get)
abi.fee_delegation(set)
